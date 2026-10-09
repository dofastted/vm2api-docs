# 调用 API

默认监听 `:8787`。需要 HTTPS 时在前面放 nginx。本页是客户端契约。管理台路由在 [管理台](./console)。出站清洗在产品 [PROTOCOL.md](https://github.com/dofastted/vm2api/blob/main/docs/PROTOCOL.md)。

## 鉴权

| 密钥 | 从哪来 | 能调什么 |
| --- | --- | --- |
| Master `VM2API_API_KEY` | `.env` | `/v1/*`、`/api/panel/*`、`/admin/*` |
| `sk-vm-…` | 管理台签发 | 仅 `/v1/*` |
| 管理台会话 | 管理台登录 | 仅 `/api/panel/*` |

两个头任选其一：

```http
Authorization: Bearer sk-vm-…
x-api-key: sk-vm-…
```

没有密钥返回 `401 missing_api_key`。协议密钥去打管理台返回 `403 forbidden`。

## 端点

| 方法 | 路径 | 客户端发送 | 客户端收到 |
| --- | --- | --- | --- |
| `POST` | `/v1/messages` | Anthropic Messages | Anthropic Messages 或 SSE |
| `POST` | `/v1/chat/completions` | OpenAI Chat | OpenAI Chat 或 SSE |
| `POST` | `/v1/responses` | OpenAI Responses | OpenAI Responses |
| `POST` | `/v1/completions` | `prompt` 字符串或非空数组 | OpenAI Completions |
| `GET` | `/v1/models` | — | 本地模型目录 |
| `GET` | `/v1/usage` | — | 当前 OAuth 账户的 5 小时 / 7 天，`unit=percent_used` |
| `POST` | `/v1/messages/count_tokens` | Anthropic count_tokens | token 计数；OAuth 时与 5 小时 / 7 天同一形状 |
| `GET` | `/health`、`/`、`/v1/meta` | 无密钥 | 存活与限制 |

不带 `/v1` 前缀的同名路径走同一组处理函数。

上游始终 `stream: true`。客户端 `stream: true` 收到 SSE。`stream: false`，或头 `x-kin-delivery: verified`，会缓冲到 `message_stop` 再返回 JSON。

## Messages

```bash
curl -sS http://127.0.0.1:8787/v1/messages \
  -H "Authorization: Bearer $KEY" \
  -H "content-type: application/json" \
  -H "x-session-id: conv-1" \
  -d '{
    "model": "claude-sonnet-5",
    "max_tokens": 128000,
    "messages": [{"role": "user", "content": "hello"}]
  }'
```

`max_tokens` 是思考和可见文本共享的预算。你不传时，OAuth 调用默认 **128000**，这也是绝对上限。网关不会抬高你已经设置的值，只会在超过模型上限时把它降下来。

`claude-sonnet-5-5` 没有原生强制工具调用。`tool_choice` 为 `any`、`tool` 或 `required` 时会改成 `{type:auto}`。点名的客户端工具会标 `strict: true`。这只约束真正发生的那次工具调用的参数，不保证模型一定会调用。需要原生强制调用时，用仍支持该能力的模型，例如 `claude-sonnet-5`。

## Chat completions

```bash
curl -sS http://127.0.0.1:8787/v1/chat/completions \
  -H "Authorization: Bearer $KEY" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-5",
    "messages": [{"role": "user", "content": "hello"}]
  }'
```

## 有用的请求头

| 头 | 作用 |
| --- | --- |
| `content-type: application/json` | POST 必填 |
| `x-session-id`、`x-conversation-id`、`x-claude-code-session-id` | 粘性键。同一 id 的后续调用在该槽仍可调度时留在同一槽 |
| `x-kin-delivery: verified` | 缓冲到 `message_stop`，再返回一个正文 |
| `x-kin-cache-ttl: 5m` | 把出站缓存 TTL 从默认 1 小时降到 5 分钟 |
| `x-kin-web-search: false` | 不要补 `web_search` 工具 |
| `X-Request-ID` | 原样写回响应头 |

正文上限默认 128MB（`KIN_MAX_BODY`）。超出后，网关在选号之前返回 `413 body_too_large`。

## 错误

协议错误形如：

```json
{"error":{"type":"upstream_error","code":"incomplete_response","message":"Assistant hop ended without visible output or stop_reason"}}
```

新槽上的 `502 incomplete_response` 常常是 DNS 或出口，不是提示词写坏了。在宿主机上：

```bash
docker exec kin-<槽> getent hosts api.anthropic.com
docker exec kin-<槽> curl -sS -o /dev/null -w '%{http_code}\n' --max-time 10 https://api.anthropic.com
```

已知的 CLI 和内核故障会保留自己的错误码、HTTP 状态和 `retry-after`，不会被改写成 `incomplete_response`。业务 SSE 已经开始之后，网关只结束这条流，不重放。

## 用量数字

非官方客户端看到的 `input_tokens` 和缓存字段，会藏起网关加上的人设 system 块和 server tools。你自己的 prompt 和 tools 仍然计入。官方 Claude Code 流量不遮罩。

## 最小检查

1. `GET /health` 返回 200。
2. 带密钥的 `GET /v1/models` 返回目录。
3. 一次 `POST /v1/messages` 返回可见回答。
4. 同一 `x-session-id` 的两次调用，在该槽仍可调度时落在同一槽。

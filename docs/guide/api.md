# Call the API

Default listen address is `:8787`. Put nginx in front if you want HTTPS. This page is the client contract. Panel routes are in [Console](./console). Outbound cleanup is in the product [PROTOCOL.md](https://github.com/dofastted/vm2api/blob/main/docs/PROTOCOL.md).

## Authentication

| Key | Where it comes from | What it can call |
| --- | --- | --- |
| Master `VM2API_API_KEY` | `.env` | `/v1/*`, `/api/panel/*`, `/admin/*` |
| `sk-vm-…` | Issued in the console | `/v1/*` only |
| Console session | Console login | `/api/panel/*` only |

Send either header:

```http
Authorization: Bearer sk-vm-…
x-api-key: sk-vm-…
```

No key returns `401 missing_api_key`. A protocol key pointed at the panel returns `403 forbidden`.

## Endpoints

| Method | Path | Client sends | Client receives |
| --- | --- | --- | --- |
| `POST` | `/v1/messages` | Anthropic Messages | Anthropic Messages or SSE |
| `POST` | `/v1/chat/completions` | OpenAI Chat | OpenAI Chat or SSE |
| `POST` | `/v1/responses` | OpenAI Responses | OpenAI Responses |
| `POST` | `/v1/completions` | `prompt` string or non-empty array | OpenAI Completions |
| `GET` | `/v1/models` | — | Local model catalog |
| `GET` | `/v1/usage` | — | Current OAuth account, 5h / 7d, `unit=percent_used` |
| `POST` | `/v1/messages/count_tokens` | Anthropic count_tokens | Token count, or the same 5h / 7d shape for OAuth |
| `GET` | `/health`, `/`, `/v1/meta` | No key | Liveness and limits |

The same handlers also answer the paths without the `/v1` prefix.

Upstream is always `stream: true`. `stream: true` on the client returns SSE. `stream: false`, or the header `x-kin-delivery: verified`, buffers until `message_stop` and then returns JSON.

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

`max_tokens` is the shared budget for thinking and visible text. If you omit it, OAuth calls default to **128000**, which is also the absolute cap. The gateway does not raise a value you already set. It only lowers one that exceeds the model cap.

`claude-sonnet-5-5` does not support native forced tool choice. `tool_choice` of `any`, `tool`, or `required` is sent as `{type:auto}`. A named client tool is marked `strict: true`. That constrains the arguments of a tool call that happens. It does not promise that the model will call the tool. Use a model that still has native forced tool choice, such as `claude-sonnet-5`, when you need that guarantee.

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

## Headers worth knowing

| Header | Effect |
| --- | --- |
| `content-type: application/json` | Required on posts |
| `x-session-id`, `x-conversation-id`, `x-claude-code-session-id` | Sticky key. Repeat calls with the same id stay on the same slot while that slot is schedulable |
| `x-kin-delivery: verified` | Buffer until `message_stop`, then return one body |
| `x-kin-cache-ttl: 5m` | Drop outbound cache TTL from the default 1h to 5 minutes |
| `x-kin-web-search: false` | Do not add a `web_search` tool |
| `X-Request-ID` | Copied back on the response |

Body limit defaults to 128MB (`KIN_MAX_BODY`). Over the limit, the gateway returns `413 body_too_large` before it picks an account.

## Errors

Protocol errors look like:

```json
{"error":{"type":"upstream_error","code":"incomplete_response","message":"Assistant hop ended without visible output or stop_reason"}}
```

`502 incomplete_response` on a fresh slot is often DNS or egress, not a bad prompt. From the host:

```bash
docker exec kin-<slot> getent hosts api.anthropic.com
docker exec kin-<slot> curl -sS -o /dev/null -w '%{http_code}\n' --max-time 10 https://api.anthropic.com
```

Known CLI and kernel failures keep their own code, HTTP status, and `retry-after`. They are not rewritten into `incomplete_response`. If business SSE has already started, the gateway ends that stream and does not replay it.

## Usage numbers

For non-official clients, `input_tokens` and cache fields hide the persona system block and server tools the gateway added. Your own prompt and tools still count. Official Claude Code traffic is not masked.

## Minimum check

1. `GET /health` returns 200.
2. `GET /v1/models` with a key returns the catalog.
3. One `POST /v1/messages` returns a visible answer.
4. Two calls with the same `x-session-id` land on the same slot while that slot stays schedulable.

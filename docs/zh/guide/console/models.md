# 模型

`http://<主机>:8787/console/#/models`

这里是 `GET /v1/models` 返回给客户端的目录，不是上游账号里「所有存在过的模型」的镜像。客户端能选的名字以这一页为准。

## 你要核对的事

- 调用方报未知模型：先看目录里有没有这个 id，再看目标槽的允许模型是不是把它排除了。槽上的允许列表可以比全局目录更窄。
- 改目录不会换槽里的官方客户端，也不会刷新 OAuth。
- `claude-sonnet-5-5` 没有原生强制工具调用。需要 `tool_choice` 一定生效时，目录里要留着仍支持强制调用的模型，例如 `claude-sonnet-5`，并让客户端选它。细节在 [调用 API](../api)。

人设布局（`zero` / `official` / `official_full`）不在模型行上改，在 [设置 → 协议](../settings#protocol) 和 [system 提示词](./system)。

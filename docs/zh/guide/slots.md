# 槽位与账号

槽位是一台隔离的机器：容器名 `kin-<槽>`，或者你选择该模板时的一台 KVM / QEMU 虚拟机。它不是 `vm2api` 容器里的一个线程。

每个已启动的槽运行官方客户端。Claude 槽最多保持 **20** 路原生 subagent 对话，各自有状态，并复用上游提示缓存。管理台上的「并行」只改控制面同时放行多少请求。它不重启内核，也不改变这 20 路。

## 先有出口

导入、换票和初装都要求槽位已经有出口：

- 远程 SOCKS5，或
- 本地出口 `px-local`（没有 SOCKS URL，控制面走宿主路由）。

没有绑定会返回 `proxy_required`。生产环境忽略 `require_proxy: false`。那个开关只给测试用。

凭证、刷新和上游调用共用这条出口。这台 VPS 不应该替该槽自己去连 Anthropic。

## 导入

管理台里有两种方式：

- **OAuth。** 控制面经槽出口完成换票，把活票写进该槽的 `credentials.json`。`vm.json` 和 SQLite 只存脱敏元数据。
- **账号文件。** 同一道门：槽必须已经存在，并且已经有出口。

Claude 导入之后，若 `routing.official_cc` 如此配置（默认自动），会排队做官方初装。同一槽再次导入会再跑一遍初装，不会因为上次说过 `already_initialized` 就跳过。

死凭证出池，并拆掉粘性。没有 refresh token 的过期票不会被调度。管理台上的「可用」就是调度开关。`POST /api/panel/vms/:id/schedulable` 只改这个开关，不改容器是否在运行。

## 配额

上游额度是滚动的 **5 小时**和 **7 天**窗口。管理台按槽显示。槽位接近窗口时，调度器不再往这里放新请求，而不是把账号打满。

槽上的 `max_concurrency` 和 `max_rpm` 钉住该槽。`null` 清除覆盖，槽位回到平台默认：Claude 用分档表，OpenAI 用 `codex.quota`。保存 Claude 分档不会改写 OpenAI 限额。

## 东西放在哪

| 数据 | 位置 |
| --- | --- |
| 活的 access / refresh token | 只在槽的 `credentials.json` |
| 脱敏账号元数据 | `vm.json` 和 SQLite |
| 协议密钥 | 管理台密钥表 |
| 请求日志 | 管理台日志 |

不要把 `credentials.json` 放进 git、面板响应或客户端。管理台的刷新响应不回 token。`fatal` 表示凭证被拒绝。`retryable` 表示稍后再试。

只有控制面的 `RefreshIfNeeded` 决定何时换票。没有第二套定时器，Go worker 也不会自己换票。

## 粘性会话

发送 `x-session-id`（或 `x-conversation-id`，或 `x-claude-code-session-id`）。该槽仍可调度时，同一 id 的后续轮次留在它上面。死凭证会清掉这根钉子。

## 集群

额外的 VPS 在集群页添加。它们是别的主机，经 SSH 到达，不是本机上的额外槽位。远端主机上的槽容器仍然遵守一个槽位一条出口。

运维终端是 WebSocket。如果一连上就断开，先查 nginx 的 `Upgrade`，再考虑重建槽位。[nginx-shell.md](https://github.com/dofastted/vm2api/blob/main/docs/nginx-shell.md)。

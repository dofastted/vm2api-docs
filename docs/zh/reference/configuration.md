# 配置

控制面读取安装目录里的 `.env`（权限 `600`）。两边都设置时，`VM2API_*` 覆盖旧的 `KIN_*`。给 systemd 用的完整抄本在产品仓库的 `docs/deploy/env.example`。

改 `.env` 需要重启控制面。这本身不会替换已经在槽内运行的内核。

## 必填

| 变量 | 作用 |
| --- | --- |
| `VM2API_API_KEY` | Master 密钥。可调用 `/v1/*` 和管理台 API。为空时生成。 |
| `VM2API_ADMIN_USER` | 管理台用户。默认 `admin`。 |
| `VM2API_ADMIN_PASSWORD` | 管理台密码。空则变成 `123456`，已有值保留。 |
| `VM2API_DB_SECRET` | 数据库密钥。为空时生成。 |

## 监听与路径

| 变量 | 默认 | 作用 |
| --- | --- | --- |
| `PORT` | `8787` | HTTP 端口 |
| `HOST` | `0.0.0.0` | 绑定地址 |
| `PUBLIC_BASE_URL` | 未设置 | 前面终结 TLS 时的公网源站 |
| `KIN_PROJECT_ROOT` | `/opt/vm2api` | 安装目录 |
| `KIN_DATA_DIR` | `/opt/vm2api/data` | SQLite 和运行时数据 |
| `KIN_KERNEL_BIN` | `/opt/vm2api/bin/kin-kernel` | 创建或同步槽位时用的内核 |
| `KIN_EGRESS_BIN` | `/opt/vm2api/bin/kin-egress` | 出口二进制 |
| `KIN_WORKER_BIN` | `/opt/vm2api/bin/kin-worker` | Worker 二进制 |
| `VM2API_HOST_ROOT` | 未设置 | Docker inspect 看不到安装目录时，显式指定宿主路径 |
| `KIN_VM_MEMORY` | 新建原生 Claude 槽为 `1g` | 创建槽容器时的内存上限 |
| `KIN_MAX_BODY` | 128MB | 请求体上限。超出后在选号前返回 `413` |

## 可选

| 变量 | 作用 |
| --- | --- |
| `GITHUB_TOKEN` 或 `VM2API_GITHUB_TOKEN` | 提高管理台检查 GitHub Release 的速率限额 |
| `VM2API_CLUSTER_SOCKET_DIR` | 集群 Docker 桥 socket 目录。默认 `$KIN_DATA_DIR/cluster`。数据目录放不了 Unix socket 时改到本地文件系统 |
| `KIN_PROXY_GEO_V6_IP_URL` | 代理地理查询用的 IPv6 探针。默认 `https://ipv6.icanhazip.com` |

## 兼容布局

人设和清洗存在路由配置里，不是环境变量。管理台的模型 / 系统页修改它们。产品里的名字是：

| 布局 | 行为 |
| --- | --- |
| `zero` | 不注入系统人设 |
| `official` | 官方形态的身份，不带完整提示包 |
| `official_full` | 完整的官方身份包 |
| 自定义 | 你自己保存的模板 |

`web_search` 只加在最后一轮 user 上，并且这一轮要提到搜索；客户端已经声明了该工具，或关掉了它（`web_search: false`、`x-kin-web-search: false` 或 `tool_choice: none`）时不补。官方 Claude Code 入站流量不会被注入搜索工具。

## OpenAI 配额对象

写在路由设置里，不在 `.env`：

```json
{"codex":{"quota":{"limit_5h":1,"limit_7d":1,"max_concurrency":2,"max_rpm":0,"max_sessions":0}}}
```

Claude 分档和这个对象互不影响。槽上的数字覆盖平台值。槽上的 `null` 清除覆盖。

## 不要放进客户端的东西

- 不要把 `VM2API_API_KEY` 放进终端用户的应用。签发一把 `sk-vm-…`。
- 不要提交 `.env`、`data/` 或任何槽的 `credentials.json`。

# 管理台

控制面在 `GET /console` 提供管理台。路由是 hash。

| 页面 | 地址 |
| --- | --- |
| 登录 | `http://<主机>:8787/console/#/login` |
| 总览 | `http://<主机>:8787/console/#/overview` |
| 虚拟机 | `http://<主机>:8787/console/#/vm` |
| 导入 | `http://<主机>:8787/console/#/import` |
| 代理池 | `http://<主机>:8787/console/#/proxies` |
| 密钥 | `http://<主机>:8787/console/#/keys` |
| 模型 | `http://<主机>:8787/console/#/models` |
| 日志 | `http://<主机>:8787/console/#/logs` |
| 集群 | `http://<主机>:8787/console/#/cluster` |
| 设置 | `http://<主机>:8787/console/#/settings` |

响应体是 `console not found; run pnpm -C web build` 的 `404`，表示这棵树没有 `web/dist`。发行镜像里已经带上了。

## 登录

默认用户是 `admin`。密码是 `VM2API_ADMIN_PASSWORD`。只有这个变量为空时，安装器才写入 `123456`，并且不会覆盖你已经设置的密码。

登录表单提交到 `POST /api/panel/login`。管理台会话可以调用 `/api/panel/*`。它不能当成协议密钥复用。

## 各页做什么

- **总览**看集群是否健康、账号是否可调度，以及近一小时的服务质量。
- **虚拟机**是槽位列表：状态、出口、5 小时 / 7 天额度，以及官方客户端初装卡片。
- **导入**用 OAuth 或账号文件添加账号。槽位必须已经有出口。
- **代理池**放 SOCKS5 出口和本地出口。地理查询走代理自己。
- **密钥**签发 `sk-vm-…` 协议密钥。这些密钥只能调用 `/v1/*`。
- **模型**是 `GET /v1/models` 返回的目录。
- **日志**一行一条请求。
- **集群**是别的 VPS 节点，不是本机槽位列表的另一份拷贝。本机是控制台，远端是 SSH 可达性。
- **设置 → 关于**显示版本和更新命令。

面板 HTTP 写在产品仓库的 [PANEL_API.md](https://github.com/dofastted/vm2api/blob/main/docs/PANEL_API.md)。响应是 `{ ok, data }` 或 `{ ok: false, error }`。业务体从 `data` 里取。

## 角色

管理台有自己的用户。协议密钥不是一种角色。Master `VM2API_API_KEY` 既能调用 `/v1/*`，也能调用 `/api/panel/*`。不要把这把密钥放进客户端应用。那些地方放签发的 `sk-vm-…`。

## 终端页

集群终端和槽位运维终端是浏览器 WebSocket。页面能打开但终端显示已断开，是 nginx 丢掉了 `Upgrade`。先修反代，再重试槽位。检查表在 [nginx-shell.md](https://github.com/dofastted/vm2api/blob/main/docs/nginx-shell.md)。

# Console

The control plane serves the console at `GET /console`. Routes are a hash router.

| Page | URL |
| --- | --- |
| Login | `http://<host>:8787/console/#/login` |
| Overview | `http://<host>:8787/console/#/overview` |
| Virtual machines | `http://<host>:8787/console/#/vm` |
| Import | `http://<host>:8787/console/#/import` |
| Proxy pool | `http://<host>:8787/console/#/proxies` |
| Keys | `http://<host>:8787/console/#/keys` |
| Models | `http://<host>:8787/console/#/models` |
| Logs | `http://<host>:8787/console/#/logs` |
| Cluster | `http://<host>:8787/console/#/cluster` |
| Settings | `http://<host>:8787/console/#/settings` |

A `404` body `console not found; run pnpm -C web build` means this tree has no `web/dist`. Release images already include it.

## Sign in

Default user is `admin`. The password is `VM2API_ADMIN_PASSWORD`. The installer writes `123456` only when that variable is empty, and it will not overwrite a password you already set.

The login form posts to `POST /api/panel/login`. A console session can call `/api/panel/*`. It cannot be reused as a protocol key.

## What each area is for

- **Overview** shows whether the cluster is healthy, whether accounts are schedulable, and the last hour of service.
- **Virtual machines** is the slot list: state, egress, 5h / 7d budget, and the official-client setup card.
- **Import** adds an account by OAuth or by an account file. The slot must already have an egress.
- **Proxy pool** holds SOCKS5 exits and the local exit. Geo lookup runs through the proxy itself.
- **Keys** issues `sk-vm-…` protocol keys. Those keys call `/v1/*` only.
- **Models** is the catalog returned by `GET /v1/models`.
- **Logs** is one row per request.
- **Cluster** is other VPS nodes, not a second copy of the slot list. The local machine is the console. Remotes are SSH reachability.
- **Settings → About** shows the version and the upgrade command.

Panel HTTP is documented in the product repository as [PANEL_API.md](https://github.com/dofastted/vm2api/blob/main/docs/PANEL_API.md). Responses use `{ ok, data }` or `{ ok: false, error }`. Read the payload from `data`.

## Roles

The panel has its own users. A protocol key is not a role. Master `VM2API_API_KEY` can call both `/v1/*` and `/api/panel/*`. Keep that key off client applications. Put an issued `sk-vm-…` key in those.

## Shell tabs

The cluster terminal and the slot ops terminal are browser WebSockets. If the page loads but the terminal says disconnected, nginx dropped `Upgrade`. Fix the proxy before retrying the slot. The checklist is [nginx-shell.md](https://github.com/dofastted/vm2api/blob/main/docs/nginx-shell.md).

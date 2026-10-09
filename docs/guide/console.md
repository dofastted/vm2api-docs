# Page map

The console is `http://<host>:8787/console/#/…`. The left nav matches the pages below. Install and update are not console screens. They are pinned at the top of this site: [Install](./install), [Update](./upgrade).

| Nav | URL | This page owns |
| --- | --- | --- |
| Overview | `#/overview` | Cluster health, whether accounts can be scheduled, the last hour of service |
| Statistics | `#/statistics` | Request, cost, and latency trends, plus user and model ranks |
| Logs | `#/logs` | One row per request: filter, export, open the body |
| Usage | `#/usage` | Per-account 5h / 7d occupancy, concurrency, and cost |
| Billing | `#/billing` | Spend by virtual machine or by key |
| Cluster | `#/cluster` | This host, plus other VPS nodes joined over SSH |
| Virtual machines | `#/vm` | Slot list, and one slot's status, egress, setup, and shell |
| Import | `#/import` | Create an empty slot, bind an exit, write the account |
| Proxy pool | `#/proxies` | SOCKS5 exits and the local exit |
| Models | `#/models` | The catalog `GET /v1/models` returns |
| Risk audit | `#/risk` | Distillation, refusal, hard regex, and the hits |
| System prompts | `#/system` | Persona templates and the inject preview |
| Keys | `#/keys` | `sk-vm-…` keys for clients |
| API | `#/api` | Named upstream endpoints, with their keys and models |
| Database | `#/database` | SQLite runtime and cache counters |
| Settings | `#/settings/sticky` | Scheduling, protocol, setup, notify, backup, about |
| Users | `#/users` | People who can sign in to the console |
| Kernel | `#/wrap` | Install and sync the in-slot kernel |

The four monitor pages do not repeat the same numbers. Overview is health. Statistics is the trend. Logs is one request. Usage is the account window.

Settings edits routing config, not `.env`. A dirty draft shows a save bar. `Ctrl/Cmd+S` saves it. SOCKS5, telemetry, backup, and about have their own buttons and do not use that bar.

# Configuration

The control plane reads `.env` in the install directory (mode `600`). `VM2API_*` overrides the older `KIN_*` name when both are set. A full copy for systemd lives at `docs/deploy/env.example` in the product repository.

Changing `.env` needs a control-plane restart. It does not, by itself, replace the kernel already running inside a slot.

## Required

| Variable | Purpose |
| --- | --- |
| `VM2API_API_KEY` | Master key. Calls `/v1/*` and the panel API. Generated when empty. |
| `VM2API_ADMIN_USER` | Console user. Default `admin`. |
| `VM2API_ADMIN_PASSWORD` | Console password. Empty becomes `123456` and an existing value is kept. |
| `VM2API_DB_SECRET` | Database secret. Generated when empty. |

## Listen and paths

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `8787` | HTTP port |
| `HOST` | `0.0.0.0` | Bind address |
| `PUBLIC_BASE_URL` | unset | Public origin, when you terminate TLS in front |
| `KIN_PROJECT_ROOT` | `/opt/vm2api` | Install directory |
| `KIN_DATA_DIR` | `/opt/vm2api/data` | SQLite and runtime data |
| `KIN_KERNEL_BIN` | `/opt/vm2api/bin/kin-kernel` | Kernel used when creating or syncing a slot |
| `KIN_EGRESS_BIN` | `/opt/vm2api/bin/kin-egress` | Egress binary |
| `KIN_WORKER_BIN` | `/opt/vm2api/bin/kin-worker` | Worker binary |
| `VM2API_HOST_ROOT` | unset | Host path of the install directory, if Docker inspect cannot see it |
| `KIN_VM_MEMORY` | `1g` for new native Claude slots | Memory cap applied when a slot container is created |
| `KIN_MAX_BODY` | 128MB | Request body cap. Over the limit returns `413` before account selection |

## Optional

| Variable | Purpose |
| --- | --- |
| `GITHUB_TOKEN` or `VM2API_GITHUB_TOKEN` | Higher GitHub release rate limit for the in-console update check |
| `VM2API_CLUSTER_SOCKET_DIR` | Directory for cluster Docker-bridge sockets. Default is `$KIN_DATA_DIR/cluster`. Move it to a local filesystem if the data directory cannot hold a Unix socket |
| `KIN_PROXY_GEO_V6_IP_URL` | IPv6 probe used by proxy geo lookup. Default `https://ipv6.icanhazip.com` |

## Compatibility layout

Persona and cleanup are stored as routing config, not as env vars. The console model / system pages edit them. The product names are:

| Layout | Behavior |
| --- | --- |
| `zero` | No injected system persona |
| `official` | Official-shaped identity, without the full prompt pack |
| `official_full` | Full official identity pack |
| custom | A template you store yourself |

`web_search` is added only on the last user turn, and only when that turn mentions search, unless the client already declared the tool or turned it off (`web_search: false`, `x-kin-web-search: false`, or `tool_choice: none`). Official Claude Code inbound traffic does not get an injected search tool.

## OpenAI quota object

Saved under routing settings, not `.env`:

```json
{"codex":{"quota":{"limit_5h":1,"limit_7d":1,"max_concurrency":2,"max_rpm":0,"max_sessions":0}}}
```

Claude tier limits and this object are independent. A per-slot number overrides the platform value. `null` on the slot clears the override.

## What not to put in the client

- Do not ship `VM2API_API_KEY` inside an end-user app. Issue an `sk-vm-…` key.
- Do not commit `.env`, `data/`, or any slot `credentials.json`.

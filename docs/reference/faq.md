# FAQ

## The health check works, but every completion is 502 incomplete_response

The console proxy probe and the slot's real path are not the same check. If the host firewall drops the slot egress gateway, the probe can look fine while the slot cannot resolve or reach the upstream.

```bash
docker exec kin-<slot> getent hosts api.anthropic.com
docker exec kin-<slot> curl -sS -o /dev/null -w '%{http_code}\n' --max-time 10 https://api.anthropic.com
```

Open the egress gateway in UFW or firewalld, then retry. Do not recreate the slot until DNS from inside it works.

## curl to 127.0.0.1:8787 fails on Docker Desktop or WSL

The port is on the container network namespace that the host loopback does not share. Run the same URL with `docker exec vm2api`.

## Import says proxy_required

The slot has no usable exit. Add a SOCKS5 proxy or use `px-local`, bind it, then import again. Production will not honor `require_proxy: false`.

## The console is 404

`GET /console` returns `console not found; run pnpm -C web build` when `web/dist` is missing. Release images include it. A source checkout that never built the web app does not.

Older notes use `/cc#/login`. The server in this tree serves `/console/#/login`.

## A protocol key cannot open the panel

That is the split. `sk-vm-…` is only for `/v1/*`. Sign in to the console, or send the master `VM2API_API_KEY`, for `/api/panel/*`.

## Upgrade deleted my slots

It should not. `install.sh upgrade` keeps `.env`, `vms/`, and `data/`, and it does not `docker rm` slot containers. It does restart the dataplane inside the slot when it syncs a new `share/wrap-cli`. If you need the old kernel for one window, pass `--no-sync-wrap` and sync later.

A control-plane restart alone does not replace a kernel that is already running in the slot. After you replace `bin/kin-kernel`, sync and restart the slot dataplane.

## native stdin: Broken pipe

Check container OOM and the CLI child, not only whether PID 1 is alive. A native Claude slot created earlier may still have a `500m` cap. The current default for new containers is `1g`.

```bash
docker update --memory 1g --memory-swap 1g kin-<slot>
```

Confirm the host has the memory before you raise it. This does not recreate the container.

## The model ignores tool_choice

`claude-sonnet-5-5` has no native forced tool choice. The gateway rewrites `any` / `tool` / `required` to `{type:auto}` and does not pretend a text reply was a tool call. Use `claude-sonnet-5` when the client requires a native forced call.

## Where is the license?

The product is public for personal learning, research, and non-commercial self-hosting. Commercial use needs written permission. The text is [LICENSE](https://github.com/dofastted/vm2api/blob/main/LICENSE) in the product repository. Questions go to Telegram [@VM2API](https://t.me/VM2API).

## Where is the rest of the operator manual?

This site is the task-shaped help. Field references that change with the code stay next to the code:

- [DEPLOY.md](https://github.com/dofastted/vm2api/blob/main/docs/DEPLOY.md)
- [API.md](https://github.com/dofastted/vm2api/blob/main/docs/API.md)
- [PANEL_API.md](https://github.com/dofastted/vm2api/blob/main/docs/PANEL_API.md)
- [OAUTH.md](https://github.com/dofastted/vm2api/blob/main/docs/OAUTH.md)
- [PROTOCOL.md](https://github.com/dofastted/vm2api/blob/main/docs/PROTOCOL.md)

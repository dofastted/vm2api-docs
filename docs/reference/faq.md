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

## 429s keep rotating accounts

A 429 with no quota evidence does not mark the slot's budget exhausted. A run of those 429s in one request stops rotation and returns the original status and error. `429 rate_limit_error: Error` during automatic compaction also does not rotate or cool the slot.

A 429 that carries quota or rate-limit evidence still follows the budget rules. Do not reinstall a slot for this 429.

## A continuation landed on another slot

Check whether the session binding is still live. While it is, raising another slot's tier or weight does not move the continuation. A move means a new session, a dead binding, budget drain, the original slot marked unschedulable, or sticky-wait timeout.

## Tools or system come back as a field error

A conversion failure names the field, stays on this machine, is not sent, and does not rotate the account. The `zero` layout passes a structured system prompt through. If the runtime rejects it, that error is also local.

An upstream billing refusal is not a body-conversion failure. Do not edit the request as if the field were wrong.

An image or tool result that cannot be kept as-is returns 400 from the panel. That is not an egress failure.

## Next-generation kernel: at cap, 403, or stuck after an update

`license_crag_host_over_quota` means the host subscription has no free running seat, so a new start is refused. A slot that is already running can still be updated. Stopped slots, slots switched back, and stranded placeholders are released before a new seat exists.

`payload_key_conflict` means the device code does not match this payload key, usually a standard package mixed with an older-license package. If the slot still depends on the older license, select the compatibility package explicitly. `license_redeem_conflict` is a redemption conflict, not the same error.

A KVM guest whose already-checked license sync returns 403: update `kin-kernel.service`, rerun `kin-guest-setup.service` from the original seed, then sync. Do not reset the virtual machine and do not reissue the license for this.

A slot that stays stopped after reinstall or update comes back only after the previous build starts and passes the license health check. Until then it stays stopped and the rollback package remains. If the subscription cannot be read, the error is returned before the slot is stopped. Do not stop it by hand first.

If a `sync-pending` lock freezes the whole machine during subscribe or kernel switch, upgrade to 1.4.134 and retry. Do not delete purchased slots to clear that lock.

## guest ssh unavailable, or setup dies after a few seconds

On KVM, a foreground command such as official Claude Code setup used to be cut at 8 seconds and reported as `guest ssh unavailable`. A start timeout exits `124`. The fix is to update and deploy the `kin-kvm` runner. Upgrading only the control plane does not fix it.

## The container will not start after a next-generation kernel reinstall

A Docker slot on a host subscription may be an old container without the license mount. Starting a stopped slot whose mount is wrong rebuilds the container. Slot data, device identity, and the existing license stay. Do not `docker rm` first.

## One cluster node is never chosen

A node that just connected prebuilds the slot image. Until that image is ready, the scheduler does not pick the node. Wait for the image. Do not remove and re-add the node. A short SSH drop keeps inference sessions that were already running on that machine.

## Gemini auth will not start, or inference is not open

Gemini is still not open for inference and is not billed. The account holder has to finish auth. The panel separates "service not connected", "no install source", and "signature check failed". On Ubuntu 22.04, if auth fails to start, update the host script. Do not open a direct connection.

Linux amd64 only. API-key mode shows only models the upstream returned. A quota that was not returned is not zero.

## Risk audit blocked a normal request

Open the ban reason and the request log beside it. Separate a gate that fired first, the judgment score, and runtime state. A false positive means tighten the rule, shorten the ban, or downgrade by group, route, or model. Do not delete the slot.

A third-party request without a full device identity does not add a device strike. Upstream HTTP 400 is counted on its own. It is not a ban count.

## Where is the license?

The product is public for personal learning, research, and non-commercial self-hosting. Commercial use needs written permission. The text is [LICENSE](https://github.com/dofastted/vm2api/blob/main/LICENSE) in the product repository. Questions go to Telegram [@VM2API](https://t.me/VM2API).

## Where is the rest of the operator manual?

This site is the task-shaped help. Field references that change with the code stay next to the code:

- [DEPLOY.md](https://github.com/dofastted/vm2api/blob/main/docs/DEPLOY.md)
- [API.md](https://github.com/dofastted/vm2api/blob/main/docs/API.md)
- [PANEL_API.md](https://github.com/dofastted/vm2api/blob/main/docs/PANEL_API.md)
- [OAUTH.md](https://github.com/dofastted/vm2api/blob/main/docs/OAUTH.md)
- [PROTOCOL.md](https://github.com/dofastted/vm2api/blob/main/docs/PROTOCOL.md)

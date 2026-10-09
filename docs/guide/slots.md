# Slots and accounts

A slot is one isolated machine: a container named `kin-<slot>`, or a KVM / QEMU virtual machine when you pick that template. It is not a thread inside the `vm2api` container.

Each started slot runs the official client. A Claude slot keeps up to **20** native subagent conversations, with their own state and with upstream prompt-cache reuse. The console "parallel" control changes how many requests the control plane will place in flight. It does not restart the kernel, and it does not change that 20.

## Egress first

Import, token exchange, and bootstrap all require a slot that already has an exit:

- a remote SOCKS5 proxy, or
- the local exit `px-local` (no SOCKS URL; the control plane uses the host route).

No binding returns `proxy_required`. Production ignores `require_proxy: false`. That bypass exists for tests.

The credential, the refresh, and the upstream call share that exit. The VPS must not open its own connection to Anthropic for that slot.

## Import

Two ways, both from the console:

- **OAuth.** The control plane runs the exchange through the slot exit and writes the live tokens into that slot's `credentials.json`. `vm.json` and SQLite store redacted metadata only.
- **Account file.** Same gate: the slot must exist and must have an egress.

After a Claude import, official first-time setup is queued when `routing.official_cc` says so (the default is automatic). Importing again on the same slot runs setup again. It does not skip because a previous run said `already_initialized`.

A dead credential leaves the pool and drops stickiness. An expired token with no refresh token is not scheduled. The console "available" flag is the scheduling flag. `POST /api/panel/vms/:id/schedulable` changes only that flag, not whether the container is running.

## Quotas

Upstream budgets are the rolling **5-hour** and **7-day** windows. The console shows them per slot. When a slot nears the window, the scheduler stops placing new work there instead of burning the account.

`max_concurrency` and `max_rpm` on a slot pin that slot. `null` clears the pin and the slot follows the platform default: Claude uses the tier table, OpenAI uses `codex.quota`. Saving a Claude tier does not rewrite OpenAI limits.

## What stays where

| Data | Where |
| --- | --- |
| Live access and refresh tokens | Slot `credentials.json` only |
| Redacted account metadata | `vm.json` and SQLite |
| Protocol keys | Console key table |
| Request log | Console logs |

Do not copy `credentials.json` into git, into a panel response, or into a client. Refresh responses from the panel omit the token. `fatal` means the credential was rejected. `retryable` means try again later.

Only the control plane's `RefreshIfNeeded` decides when to refresh. There is no second timer, and the Go worker does not refresh on its own.

## Sticky sessions

Send `x-session-id` (or `x-conversation-id`, or `x-claude-code-session-id`). While that slot remains schedulable, later turns of the same id stay on it. A dead credential clears the pin.

## Cluster

Extra VPS nodes are added on the cluster page. They are other hosts, reached over SSH, not extra slots on this machine. Slot containers on a remote host still follow the same one-slot, one-egress rule.

The ops terminal is a WebSocket. If it disconnects immediately, check nginx `Upgrade` before you recreate the slot. [nginx-shell.md](https://github.com/dofastted/vm2api/blob/main/docs/nginx-shell.md).

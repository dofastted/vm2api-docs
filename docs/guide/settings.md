# Settings

Open `http://<host>:8787/console/#/settings/sticky`. The groups on the left only change order. Most tabs need an explicit save, or `Ctrl/Cmd+S`. Leaving with a dirty draft does not save it for you.

SOCKS5, telemetry, backup, and about have their own buttons. They do not use the global save bar.

## Sticky {#sticky}

`#/settings/sticky`

A returning device stays on its slot. Three controls:

- **Binding.** Which header means "the same device". Callers should send `x-session-id`, or `x-conversation-id`, or `x-claude-code-session-id`.
- **TTL.** How long that binding still counts. After it expires, the next request picks a slot as a new device.
- **Outbound.** After the slot is chosen, how the outbound identity follows the binding.

A dead credential drops stickiness. A slot you marked unschedulable will not take new turns for that binding. The button shows "pending save" until you save.

## Pool {#pool}

`#/settings/pool`

Where a new request goes when more than one slot has room.

- **Balanced.** A new device goes to the slot with the lowest occupancy. Load spreads out.
- **Fill.** A new device goes to the fullest slot that is not full yet. A few slots get used up, the rest stay idle.

A returning device tries its old slot first, then the global queue. **Manual switch wins** keeps a slot you turned off on the virtual-machine page from being switched back on by the pool. The per-VM seat cap set here is the global value. A number pinned on one slot wins over it.

The live seat dialog shows what is running now, not the draft you have not saved.

## Quota {#quota}

`#/settings/quota`

Claude and OpenAI are separate tabs. Saving one does not write the other.

Claude tiers:

| Tier | Who it is |
| --- | --- |
| Default | Unknown plan, or no credential yet |
| Pro | An ordinary Claude account |
| Max | An account that can use Fable |

Each tier has concurrency, RPM, and how the 5-hour and 7-day windows gate traffic. Turning off **5h gate** or **7d gate** means a full window can still be sent, and the upstream will refuse it itself.

**Weekly split** is experimental and Claude-only. When it is on, a fixed share of the 7-day remainder is kept for Max/Fable.

OpenAI uses `codex.quota`: `limit_5h`, `limit_7d`, `max_concurrency`, `max_rpm`, `max_sessions`.

A number on one slot pins that slot. Clearing it drops the pin immediately and the slot follows the platform value on this page.

## Logs {#logs}

`#/settings/logs`

| Mode | Result |
| --- | --- |
| Off | Request logs stop growing. New hours in statistics, billing, and prompt-cache charts stay empty |
| Normal | The everyday granularity |
| Debug | For an incident. Noisier. Do not leave it on |

This is the switch. Reading and export are on [Logs](./console/logs).

## Protocol {#protocol}

`#/settings/protocol`

Persona layout, overlay, cache TTL, and how proxied official traffic is recognized. Save forces the inference engine to `rust` and turns off the Go fallback. The public build has one inference path: rust cli-hop.

Cache TTL: `1h` is billed at 2×, `5m` at 1.25×. A caller can send `x-kin-cache-ttl: 5m` to drop one request to 5 minutes.

Cache breakpoints keep the system tail and the tools tail off. Messages go through cli-hop. There is no switch here that turns the slot into an HTTP emulation.

Inheriting protocol onto existing Claude slots clears a per-slot `persona_preset` so the slot follows this page. GPT slots are not part of that inherit.

## Whitelist {#whitelist}

`#/settings/whitelist`

Override rules. When the last user turn matches, the override text fills `{{rules}}` in the overlay. A row with an empty match or an empty override is dropped on save.

While overlay is off, every rule is inert. Turn overlay on from the protocol tab first. `prompt-leak` has no second form. It is this grid.

## First-time setup {#init}

`#/settings/init`

Global defaults for official Claude Code setup. Save pins inference to cli-hop.

- **Hello prompt.** What that setup turn says. 200 characters max.
- **Per-turn timeout.** How long the hello turn may run.
- **Setup memory.** Memory for that setup run. This is not the long-term container cap. That cap is `KIN_VM_MEMORY` or `docker update`.

Importing again on the same slot queues setup again. It does not skip because the previous run succeeded. The per-slot card on [Virtual machines](./console/vm) can run hello again or write the login file for one slot.

## Probe {#health}

`#/settings/health`

On a timer, a real slot runs one turn and the result is cached. Channel tests and account pings (`hi` / `ping`) replay that cache and do not hit upstream.

This is not the proxy-pool check that a SOCKS port is open. The proxy probe can be green while this cache is empty and real calls still return 502.

**Signature repair** on the same tab decides whether a thinking block with a bad signature is repaired before it is sent. It does not edit the account credential.

## Notify {#notify}

`#/settings/notify`

| Event | When it fires |
| --- | --- |
| Pool empty | Schedulable accounts hit 0 |
| Pool low | Below the minimum you set |
| Pool recovered | Back above the low-water mark |
| Digest | A summary on the interval |
| Revoked | A newly revoked account |
| Invalid | A newly invalid credential |
| Account down | One account became unschedulable |
| Account up | One account became schedulable again |

The channel is a Telegram bot. Save the enable switch and the events, then send the test from the bot card. With no bot, an enabled policy still delivers nothing.

## Telemetry {#telemetry}

`#/settings/telemetry`

Whether the official client reports telemetry the way a normal developer machine would. This tab saves itself. Turning telemetry off does not turn inference off. Turn it on when you want the official shape, and only after the slot's hardware identity is complete. Otherwise you are just emitting telemetry from a VPS that does not look like a workstation.

## SOCKS5 {#socks5}

`#/settings/socks5`

Global exit policy, including whether a slot must have a proxy. Production has no persistent "allow import with no exit" switch. Host, port, and password for each proxy are on the [proxy pool](./console/proxies), not a list you paste on this tab.

## Backup {#backup}

`#/settings/backup`

Create a backup. The list shows time and id. Download or delete from that row. This is the copy you can restore. The database page only shows runtime counters. It does not write a file.

A backup restores onto a machine whose `VM2API_DB_SECRET` is the secret from the moment the backup was taken. A different secret does not open it.

## About {#about}

`#/settings/about`

**Current** tag, **latest on GitHub**, whether an update exists, and the changelog. A failed check is usually the GitHub API rate limit. Set `GITHUB_TOKEN` or `VM2API_GITHUB_TOKEN`, restart the control plane, and check again.

The one-click update, when it only copies a host command, and when `wrap-cli/sync` still requires the kernel page, are the pinned [Update](./upgrade) page. Do not press the button from this paragraph alone.

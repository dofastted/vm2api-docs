# Risk audit

`http://<host>:8787/console/#/risk`

A request can hit gates before it reaches a slot. This page shows whether each gate is on, what it caught today, and whether it caught a legitimate call. Unsaved edits are dropped when you leave. The browser asks first.

## Gates

A gate is on, off, on but with no address configured, or still loading.

- **Distillation.** Drops chain-of-thought scraping and distillation attempts before upstream credit is spent.
- **Refusal.** Patterns the upstream already refused (AUP / `stop_reason=refusal`) can be cached and stopped at the gateway so the same prompt is not sent at the account again.
- **Hard regex.** Rules you wrote. A match is blocked.
- **Decision model.** A model does the judgment. "On but no address" means the gate is not actually connected. Do not treat that state as protection.

## Hits

The list is the recent set, or "today, N rows" when there is nothing older on screen. Open a row to read the body and decide if it was a false positive. A false positive means tighten or disable that gate. It does not mean delete the slot.

Risk audit does not replace logs. Calls that were allowed are on [Logs](./logs). This page is only what a gate touched.

## Order of checks, and bans

Hard rules, tool limits, and the refusal cache run first. The user message and attachments are judged after that. A hit can be downgraded by group, route, or model instead of refused. Pick the downgrade target from the account pool, an API channel, or the model catalog.

Strikes merge by device and machine identity. The offending session is blocked on its own. A device is banned for 10 minutes, then 24 hours, then permanently. A third-party request that does not carry a full identity does not add a device strike.

The page splits three views: the gate that fired first, the judgment score, and runtime state. A ban reason opens the related request log. Upstream HTTP 400 is its own column. It is not the downgrade-route counter.

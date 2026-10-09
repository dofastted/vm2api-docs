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

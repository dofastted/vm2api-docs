# Usage

`http://<host>:8787/console/#/usage`

Per account: the 5-hour window, the 7-day window, concurrency, and cost. Overview only says whether scheduling is possible. This page says how much is left.

## Where the numbers come from

The probe uses the slot's own exit. It does not let the control plane dial upstream directly. A Setup Token whose scope is only `user:inference` gets a scope error from the official usage API, so you see a failed probe instead of a percentage. A full OAuth scope is what can call official `/api/oauth/usage`.

`GET /v1/usage` returns the same 5-hour / 7-day view for the current OAuth account, with `unit=percent_used`. It does not write or clear stickiness.

## When a window is full

The scheduler stops placing new work on that slot as the window fills. The account is not deleted. Wait for the window to roll, or use a slot that still has room. Whether the gates are armed is [Settings → Quota](../settings#quota). The 5h gate and the 7d gate can be turned off separately. Off means a full window may still be sent, and the upstream will refuse it.

Concurrency and RPM pinned on one slot override the platform default behind this page.

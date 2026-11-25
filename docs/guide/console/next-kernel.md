# Next-generation kernel

`http://<host>:8787/console/#/wrap`

This page is the usage guide for that kernel only. Install, switch, subscription, and update live here. Technical detail does not.

The nav label is still **Kernel**. It shares the page with the previous kernel: pick the kernel, then install or switch the slots you selected. This page does not create a slot and it does not import an account. Empty slots and egress stay on [Import](./import).

Documented against product **1.4.135**. A control-plane upgrade does not switch slots onto this kernel, and it does not restart a slot that is already running.

## Before you start

1. The slot exists and has an egress. Import and refresh return `proxy_required` without one.
2. A valid host subscription with a free seat is required only when this action **takes a new** subscription seat. A slot that already has a valid license does not need a free seat first. That covers an update on the same slot, a same-slot switch of the current version, and an older offline license that is still valid. Docker, KVM, and cluster share that one quota. It is not split by version.
3. Change only the slots you mean to move. Slots on the previous kernel can keep running.

The sign-in page has **Buy without signing in**. The same browser can **View orders**. After payment is delivered, choose **Apply to this machine**. When you are already signed in, use **Subscribe** in the sidebar to buy, renew, collect a code, and activate. A code issued on an order is not the same as a redemption on this machine.

## Install or switch

1. Open Kernel and select the target slots.
2. Choose **Next-generation kernel**. If the slot still depends on an older license, choose the download marked for older-license compatibility. Do not choose the standard package.
3. Confirm install or switch. An existing subscription on that same slot is reused and does not take another seat. With no subscription yet, a remaining host seat is used.
4. Wait until the slot is schedulable again. The switch restarts the in-slot process. It does not delete the slot and it does not replay a request that was already sent. The slot is not stopped until a valid license is in place.

You do not authorize a single slot before these actions:

- Opening a new slot on this kernel
- Importing an existing slot and switching it over
- Switching only the inference kernel onto this one

When the host subscription is at its running-seat cap, a new start is refused. Slots that are already running keep serving. Stopped slots, slots switched back, and stranded placeholders are released and do not hold a seat.

## How quota is counted

| What you see | What it means |
| --- | --- |
| One status | Whether this machine's subscription is valid |
| Seats left to bind | How many new slots you can start now |
| Used / remaining | Seats currently held on the roster |

- Each host redemption code keeps its own clock from the moment it is redeemed. Unexpired balances add. Expiry removes only that grant.
- Switching the current version on the same slot reuses the existing license. A full quota does not require a second seat.
- Deleting a slot, switching one slot or a batch back, and this kernel install all release the seat.
- A reinstall resigns when that slot already has a subscription. Otherwise it uses a remaining seat. An ordinary bind does not resign.

A slot that is already running can still be updated when the host is at cap. The running quota does not reject that update.

## Day to day

The call path does not change. Clients still use `/v1/messages`, `/v1/chat/completions`, or `/v1/responses`. Keys, sticky sessions, and egress stay in [Call the API](../api) and [Slots and accounts](../slots).

What changes on the console:

- **A live session stays on its slot.** An existing Claude or Codex binding wins over another slot's tier or weight. Raising those does not move a continuation. New sessions, and reselection after stickiness is gone, still follow tier and pool policy.
- **The original slot is briefly unavailable.** A Claude continuation that is already queued keeps waiting on that slot. Budget drain, unschedulable state, and sticky-wait timeout still move it under the existing rules.
- **Tools and images.** Supported hosted tool definitions are kept when the call is forwarded to Claude. Under the `zero` layout, a structured system prompt is passed through. If the runtime cannot accept it, the error names the field and is returned locally. The request is not sent and the account is not rotated.
- **Inline images.** Images inside tool results keep their order. Input that cannot be kept as-is returns 400 from the panel. It is not rewritten and retried.
- **Continuation cache.** Caller tool names, system-prompt blocks, and cache breakpoints stay where they were, so a later turn is not rewritten.
- **Telemetry.** The panel can turn it on or off. The switch applies only to slots on this kernel. A stopped slot only stores the setting. To apply it, drain the slot, restart the kernel, then restore the previous schedule. The panel separates "applied" from "upload verified".
- **Refresh usage on demand.** On a Claude slot, the list, rack, usage dialog, and detail page can refresh the official window. The refresh reuses that slot's credential and egress. It does not send a model probe. Concurrent refreshes on the same slot are merged. An official 429 backs off. Failure is a specific error.

If scheduling is blocked with `license_crag_host_over_quota`, the host subscription is at cap. That is not a banned account and it is not an egress failure.

## Update

1. Upgrade the control plane first, using [Update](../upgrade). Check the About version and `/health`.
2. This kernel is **not** reinstalled by a control-plane upgrade. When the changelog says no `wrap-cli/sync` and no slot reinstall, do not reinstall just to chase the version.
3. Download the package on the Kernel page only when you intend to move to that build, then confirm install on the selected slots.
4. If the candidate install fails, the slot returns to service only after the previous build starts again and passes the license health check. Otherwise it stays stopped and the rollback package is kept.
5. If the subscription cannot be read, the error is returned before the slot is stopped.

The current factory default download is the **3.1.4 standard** package. An older-license deployment must select the compatibility package explicitly. Do not let it pull the standard package.

## After an update

- About shows the target version and `/health` is 200.
- The slot is still schedulable, and official setup did not drop to signed-out.
- Seats left on the subscription page match the slots that are actually running. A deleted or switched-away slot must not keep a seat.
- Send one `/v1/messages` with a key that worked before the upgrade.

## Do not

- Do not reinstall every slot because the control plane moved.
- Do not stop a slot by hand before a license is in place.
- Do not put the standard package on a slot that still depends on an older license.
- Do not switch kernels to fix egress, DNS, or 502. Those stay in the [FAQ](../../reference/faq).

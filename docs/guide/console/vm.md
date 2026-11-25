# Virtual machines

List: `http://<host>:8787/console/#/vm`  
One slot: `http://<host>:8787/console/#/vm/<id>`

A slot is one isolated machine. The container name is `kin-<slot>`, or a KVM / QEMU guest when you picked that template. It is not a thread inside the `vm2api` container.

## On the list

- Status, egress, 5-hour / 7-day, and whether it is schedulable. "Available" on the console is exactly "the scheduler may pick it".
- Toggle schedulable. That only changes pool membership. It does not start or stop the container. The API is `POST /api/panel/vms/:id/schedulable`.
- Open the detail. An empty slot can also be created from **Create vm** on [Import](./import). The list is not the only door.

A slot you have not started has no container. Missing `kin-<id>` in `docker ps` is expected until you start it.

Rows are compact. Sort from the column header. Secondary fields show on hover, focus, or expand, and can be pinned visible. The top line summarizes how many are in the pool, the last 24 hours of success rate and request count, 7-day spend, seats, and the queue. Click a row to expand it. The button on the left opens the detail page.

Schedule and priority share one column. The second line is why the slot is limited or not schedulable. The status bar is the last 24 hours of success rate plus an error-rate timeline. No requests in that window means no health figure, and the page does not probe to invent one. Host memory pressure is shown on Overview and the cluster machine table, not stamped onto every slot on that machine.

A Claude slot has **Refresh usage**. It reuses that slot's credential and egress and does not send a model probe. Repeated clicks on the same slot collapse into one query. An official 429 backs off. Failure names the reason.

## On the detail

- **Overview.** Identity, platform (Claude or GPT), current engine, cost split by model.
- **Account.** Whether access and refresh tokens exist, and when they expire. The page does not show the token. A failed refresh is `fatal` (credential rejected, import again) or `retryable` (try later).
- **Egress.** Which SOCKS5 this slot is bound to, or the local exit `px-local`. Rebind here or in the import flow. With no binding, import and token exchange return `proxy_required`.
- **Official setup** (Claude). Queue, wipe the setup environment, refresh an expired token, write the official login file, hello, read usage, read plan and models. Exchanging again on the same slot runs setup again. It does not skip on `already_initialized`.
- **Test.** One turn on this slot, not through another slot. Use it to separate "this slot is broken" from "the scheduler picked the wrong slot".
- **Ops shell.** WebSocket. An immediate drop is nginx `Upgrade`, not a reason to delete the slot.
- **Parallel / seats.** How many requests the control plane will place on this slot at once. It does not restart the kernel, and it does not change the 20 native subagent conversations a Claude slot already has.

## Memory and Broken pipe

A new native Claude slot defaults to `1g`. An older slot can still be on `500m`. Upgrading the control plane does not resize it. On `native stdin: Broken pipe`, check OOM and the CLI child together. After you know the host has the memory:

```bash
docker update --memory 1g --memory-swap 1g kin-<slot>
```

That does not recreate the container and does not replace the kernel. Kernel replacement is the [Kernel](./kernel) page.

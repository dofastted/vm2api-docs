# Statistics

`http://<host>:8787/console/#/statistics`

Request volume, spend, and latency over a longer window than Overview's last hour, plus ranks by user, provider, and model. There is no request body here.

## How to use it

- A cliff after an update means check that the control plane and the slots are still up before you edit the model catalog.
- Ranks answer which model and which key spent the money. Per-day detail for one key is the stats dialog on [Keys](./keys), in Asia/Shanghai days.
- A live session on this page can filter [Logs](./logs) to that session.

Statistics reads request logs that were stored. If log mode is Off, this page goes empty. The mode is [Settings → Logs](../settings#logs).

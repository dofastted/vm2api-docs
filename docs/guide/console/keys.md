# Keys

`http://<host>:8787/console/#/keys`

Protocol keys for clients, shaped `sk-vm-…`. They can call `/v1/*` only. Console login and the panel API still use a user session or the master `VM2API_API_KEY`.

## Generate

**Generate** shows the plaintext once. The database stores a hash. The list cannot show the original later. If you did not copy it, rotate. Do not go looking for it in logs.

## Limits and stats

Each key can have its own concurrency and quota. The stats dialog uses Asia/Shanghai days: today's cost and requests, the most expensive day, the busiest day, cumulative tokens, average latency, success and failure over 7 days, and a split by model and by virtual machine.

## Rotate

**Rotate** invalidates the old value immediately. Clients receive 401. Name, class, concurrency, quota, and historical stats stay. Because the plaintext is not stored, rotation is the only way to replace it.

## Delete

Delete invalidates immediately. Further use is 401. Delete does not refund spend that already happened. The history on the billing page remains.

Do not put the master key in a client config. The master key can change the panel. A protocol key cannot.

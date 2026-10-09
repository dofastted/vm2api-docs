# Proxy pool

`http://<host>:8787/console/#/proxies`

Every slot exit lives here: remote SOCKS5, and the local exit `px-local`. An exit can be bound to a slot. A slot uses only the one it is bound to.

## Import

Paste a SOCKS5 URL or line. Save runs the same checks as account import: host, port, optional username and password.

## Edit

A field is interpreted by whether the key is present:

- Key omitted: keep the current value.
- Key set to an empty string: clear it. An empty username also clears the password.

After save, the row's displayed `raw` is rewritten as `host:port`. A password that arrived in the original import line is not left in that column.

## Geo

**Geo lookup** goes out through that proxy, not through the control plane's default route. IPv4 lands in `geo`. IPv6 lands in `geo_v6`. IPv6 first uses an AAAA-only probe (default `https://ipv6.icanhazip.com`, override with `KIN_PROXY_GEO_V6_IP_URL`) to prove the exit is IPv6. If the probe returns IPv4, the error is `geo_ipv6_got_ipv4`. No IPv6 exit is a transport failure, not a broken geo database.

The local exit uses the host route, so its geo is the host's exit, not a SOCKS exit.

## Relation to slots

Prepare the proxy here, then bind it on [Import](./import) or on the slot detail. A proxy that is only in the pool, and not bound, still makes import return `proxy_required`. A green proxy probe does not mean the firewall has opened the slot egress gateway.

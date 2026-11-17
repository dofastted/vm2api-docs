# 代理池

`http://<主机>:8787/console/#/proxies`

槽的出口都在这里：远程 SOCKS5，以及本地出口 `px-local`。一条出口可以被槽绑定。一个槽同时只用它绑的那一条。

## 导入

粘贴 SOCKS5。保存前会做和导入相同的校验：主机、端口、可选的用户名和密码。

::: tip 推荐出口：ProxyLane
[ProxyLane](https://proxylane.dev/go/vm2api-docs) 提供 Claude Max 专用的原生静态住宅 IP：Scamalytics 低欺诈评分，每个 IP 独享，不限流量，$7.90 起。

1. 在 ProxyLane 后台复制 SOCKS5 连接，格式是 `host:port:user:pass`。
2. 粘贴到「代理池」→「添加代理」，点「导入」。
3. 在「导入」或槽详情里把这条出口绑到一个槽位。建议一个 IP 只给一个槽位。

首次购买使用优惠码 `VM2API30` 享 7 折。
:::

## 修改

编辑时按「这个键在不在」判断：

- 不传这个键：保持原值。
- 传空字符串：清掉。用户名传空会连密码一起清。

保存后，这一行对外展示的 `raw` 会重写成 `host:port`，导入时带上的明文密码不再留在那一列。

## 地理信息

**查地理** 经这条代理自己访问，不经控制面的默认路由。IPv4 结果在 `geo`，IPv6 在 `geo_v6`。IPv6 先用只查 AAAA 的探针（默认 `https://ipv6.icanhazip.com`，可用 `KIN_PROXY_GEO_V6_IP_URL` 换）确认出口是 IPv6。探针返回 IPv4 时记 `geo_ipv6_got_ipv4`。没有 IPv6 出口是传输失败，不是地理库坏了。

本地出口走宿主默认路由，所以它的地理信息是宿主机的出口，不是某条 SOCKS。

## 和槽的关系

在这一页把代理准备好，再到 [导入](./import) 或槽详情里绑定。只把代理加进池里、没有绑到槽上，导入仍会 `proxy_required`。探测显示代理可用，不代表防火墙已经放行槽的出口网关。

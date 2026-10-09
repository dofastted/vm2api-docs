# 常见问题

## 健康检查是通的，但每次补全都是 502 incomplete_response

管理台的代理探测和槽位的真实路径不是同一次检查。宿主防火墙丢掉槽出口网关时，探测可以看起来正常，槽内却解析或访问不了上游。

```bash
docker exec kin-<槽> getent hosts api.anthropic.com
docker exec kin-<槽> curl -sS -o /dev/null -w '%{http_code}\n' --max-time 10 https://api.anthropic.com
```

在 UFW 或 firewalld 里放行出口网关，然后再试。槽内容器里的 DNS 通之前，不要重建槽位。

## Docker Desktop 或 WSL 上 curl 127.0.0.1:8787 失败

端口在容器网络命名空间里，宿主回环不一定共享。用 `docker exec vm2api` 访问同一个 URL。

## 导入提示 proxy_required

槽位没有可用出口。先加一条 SOCKS5 或使用 `px-local`，绑定后再导入。生产环境不会理会 `require_proxy: false`。

## 管理台 404

`web/dist` 不存在时，`GET /console` 返回 `console not found; run pnpm -C web build`。发行镜像里有这份构建。从未构建过网页的源码检出没有。

旧说明用 `/cc#/login`。这棵树的服务提供的是 `/console/#/login`。

## 协议密钥打不开管理台

这是故意分开的。`sk-vm-…` 只用于 `/v1/*`。要调 `/api/panel/*`，请登录管理台，或发送 Master `VM2API_API_KEY`。

## 升级把槽删了

不应该。`install.sh upgrade` 保留 `.env`、`vms/` 和 `data/`，也不会 `docker rm` 槽容器。它在同步新的 `share/wrap-cli` 时会重启槽内数据面。如果这一小段时间还要用旧内核，加上 `--no-sync-wrap`，以后再同步。

只重启控制面，不会替换已经在槽内运行的内核。换了 `bin/kin-kernel` 之后，还要同步并重启槽的数据面。

## native stdin: Broken pipe

同时看容器 OOM 和 CLI 子进程，不要只看 PID 1 是否还在。更早创建的原生 Claude 槽可能仍是 `500m` 上限。现在新建容器的默认是 `1g`。

```bash
docker update --memory 1g --memory-swap 1g kin-<槽>
```

调高之前确认宿主还有这些内存。这不会重建容器。

## 模型不理会 tool_choice

`claude-sonnet-5-5` 没有原生强制工具调用。网关把 `any` / `tool` / `required` 改成 `{type:auto}`，也不会把一段普通文本伪装成工具调用。客户端要求原生强制调用时，用 `claude-sonnet-5`。

## 许可证在哪

产品公开用于个人学习、研究和非商用自建。商用需要书面授权。正文在产品仓库的 [LICENSE](https://github.com/dofastted/vm2api/blob/main/LICENSE)。问题到 Telegram [@VM2API](https://t.me/VM2API)。

## 更完整的运维手册在哪

本站是按任务写的帮助。会跟着代码变的字段说明留在代码旁边：

- [DEPLOY.md](https://github.com/dofastted/vm2api/blob/main/docs/DEPLOY.md)
- [API.md](https://github.com/dofastted/vm2api/blob/main/docs/API.md)
- [PANEL_API.md](https://github.com/dofastted/vm2api/blob/main/docs/PANEL_API.md)
- [OAUTH.md](https://github.com/dofastted/vm2api/blob/main/docs/OAUTH.md)
- [PROTOCOL.md](https://github.com/dofastted/vm2api/blob/main/docs/PROTOCOL.md)

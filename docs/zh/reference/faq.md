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

## 429 之后一直在换号

没有配额证据的 429 不会把槽标成额度耗尽。同一次请求里如果连续出现这种 429，换号会停，并把原来的状态和错误返回去。自动压缩时看到的 `429 rate_limit_error: Error` 同样不换号、不冷却槽。

有配额或限流证据的 429 仍按额度规则处理。不要为了这种 429 去重装槽。

## 续轮跑到了另一台槽

先看这根会话绑定还在不在。绑定还在时，调高别的槽的等级或权重不会把续轮迁走。会换槽的是新会话、绑定已失效、额度退水、原槽不可调度，或粘性等待超时。

## 工具或 system 被改坏，返回字段错误

转换失败会写明字段，请求停在本机，不会发出去，也不会换号。`zero` 布局会原样传递结构化 system。运行时不接受时同样在本机报错。

上游因为计费拒绝，不是正文转换失败。不要按字段错误去改那次请求。

图片或工具结果无法按原样保留时，面板返回 400。这不是出口故障。

## 新一代防封内核报满额、403、或更新后停住

`license_crag_host_over_quota` 是宿主订阅的运行名额用满，不能再新开一台。已经在跑的槽可以继续更新，不受这条拒绝。停机、已切回旧内核、已孤立的占位会被收回，收回之后才有新名额。

`payload_key_conflict` 是设备码和这套载荷密钥对不上，通常是标准包和旧授权包混用。仍依赖旧授权时，显式选旧授权兼容包。`license_redeem_conflict` 是兑换冲突，不是同一件事。

KVM 来宾上已校验的许可同步返回 403：先更新 `kin-kernel.service`，再用原来的 seed 重新跑 `kin-guest-setup.service`，然后同步。不要因此重置虚拟机，也不要重新签发许可。

重装或更新之后槽停着：只有旧版本重新启动并通过鉴权健康检查，才会恢复运行。没通过就保持停止，回滚包还在。订阅状态读不到时，错误会在停槽之前返回，不要手动先停。

订阅或切内核时如果整机被一个 `sync-pending` 锁住，升级到 1.4.134 之后再操作。不要为了这把锁去删已购槽。

## guest ssh unavailable，或初装几秒就断

KVM 上官方初装等前台命令被 8 秒截断时，会误报 `guest ssh unavailable`。启动超时的退出码是 `124`。修这个要更新并部署 `kin-kvm` runner。只升控制面不够。

## 重装新一代防封内核后容器起不来

使用宿主订阅的 Docker 槽，旧容器可能没有授权挂载。启动一台已停止、且挂载不对的槽时会重建容器。槽数据、设备身份和已有授权还在。不要先 `docker rm`。

## 集群上有一台节点一直不被选中

节点刚连上时会预建槽位镜像。镜像还没好，调度不会自动选这台。等镜像就绪，而不是把节点删了重加。SSH 短暂断开时，这台机器上已经在跑的推理会话会保留。

## Gemini 授权起不来，或推理没有开通

Gemini 仍不对外推理，也不计费。授权要账号持有人完成。面板把「服务未连接」「缺少安装源」「验签失败」分开显示。Ubuntu 22.04 上授权启动失败时，先更新宿主脚本，不要改成直连。

只支持 Linux amd64。API Key 模式只显示上游返回的模型，没返回的配额不会是 0。

## 风险审计把正常请求拦住了

先看封禁原因和旁边的请求日志，分清是前置拦截、判定分数，还是运行状态。误伤就收紧规则、缩短封禁，或改成按分组、路由、模型降级放行。不要删槽。

没有带齐设备身份的第三方请求，不累计设备封禁。上游 HTTP 400 单独统计，不是封禁次数。

## 许可证在哪

产品公开用于个人学习、研究和非商用自建。商用需要书面授权。正文在产品仓库的 [LICENSE](https://github.com/dofastted/vm2api/blob/main/LICENSE)。问题到 Telegram [@VM2API](https://t.me/VM2API)。

## 更完整的运维手册在哪

本站是按任务写的帮助。会跟着代码变的字段说明留在代码旁边：

- [DEPLOY.md](https://github.com/dofastted/vm2api/blob/main/docs/DEPLOY.md)
- [API.md](https://github.com/dofastted/vm2api/blob/main/docs/API.md)
- [PANEL_API.md](https://github.com/dofastted/vm2api/blob/main/docs/PANEL_API.md)
- [OAUTH.md](https://github.com/dofastted/vm2api/blob/main/docs/OAUTH.md)
- [PROTOCOL.md](https://github.com/dofastted/vm2api/blob/main/docs/PROTOCOL.md)

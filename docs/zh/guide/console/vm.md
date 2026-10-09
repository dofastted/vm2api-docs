# 虚拟机

列表：`http://<主机>:8787/console/#/vm`  
单个槽：`http://<主机>:8787/console/#/vm/<id>`

一个槽是一台隔离的机器，容器名 `kin-<槽>`，或者你选了真虚拟机模板时的 KVM / QEMU。它不是 `vm2api` 容器里的一个线程。

## 列表上能做的事

- 看状态、出口、5 小时 / 7 天、是否可调度。管理台上的「可用」就是调度会不会选它。
- 打开或关掉可调度。这只改入池开关，不启动、也不停止容器。对应 API 是 `POST /api/panel/vms/:id/schedulable`。
- 进详情。创建空槽也可以从 [导入](./import) 的「创建 vm」开始，列表不是唯一入口。

没点启动的槽没有容器。`docker ps` 里找不到 `kin-<id>` 是正常的，只要你还没启动它。

## 详情里的几块

- **概览**：身份、平台（Claude 或 GPT）、当前引擎、费用按模型拆开。
- **账号**：凭证是否还有 access / refresh、过期时间。页面不回显 token。刷新失败分 `fatal`（凭证被拒，要重新导入）和 `retryable`（过一会再试）。
- **出口**：这条槽绑的是哪条 SOCKS5，或本地出口 `px-local`。改绑在这里或在导入流程里做。没有绑定时导入和换票都会 `proxy_required`。
- **官方初装**（Claude）：排队、清空初装环境、刷新过期票、写入官方登录文件、hello、读额度、读账号等级和模型。同一槽再次换票会重新初装，不因为 `already_initialized` 跳过。
- **测试**：用这个槽打一次对话，不经过别的槽。用来区分「这台槽坏了」和「调度选错了槽」。
- **运维终端**：WebSocket。秒断去查 nginx `Upgrade`，不是去删槽。
- **并行 / 席位**：改的是控制面同时往这台槽放多少请求。不重启内核，也不把 Claude 槽原生的 20 路 subagent 改成别的数。

## 内存和 Broken pipe

新建的原生 Claude 槽默认 `1g`。旧槽可能仍是 `500m`，升级控制面不会自动改它。`native stdin: Broken pipe` 时同时看 OOM 和 CLI 子进程。确认宿主还有内存再执行：

```bash
docker update --memory 1g --memory-swap 1g kin-<槽>
```

这不重建容器，也不换内核。换内核去 [内核](./kernel)。

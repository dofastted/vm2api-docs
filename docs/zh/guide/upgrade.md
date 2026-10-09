# 更新

已经在跑的机器用这一页。新机器用 [安装](./install)。

更新**保留** `.env`、`vms/`、`data/`。不要为了升级执行 `docker rm` 槽容器。控制面可以短暂中断，槽里的凭证文件还在。

## 更新之前

1. 打开管理台 [设置 → 关于](./settings#about)：`http://<主机>:8787/console/#/settings/about`。
2. 看 **当前** 和 **GitHub 最新**。徽章是「已是最新」就不用继续。徽章是「有更新」再往下。
3. 读这一跨度的 Changelog。带 `wrap-cli/sync` 徽章的版本，控制面升完之后还要同步槽内 kernel。只重启 `vm2api` 容器不会替换已经在槽里跑的内核。
4. 确认宿主机还能跑 `docker` 和 `sudo`。管理台里的一键更新有时只能把宿主机命令复制出来，真正拉镜像发生在宿主机上。

## 方式 A：管理台一键更新

在 **关于** 页：

1. 点 **检查更新**，确认最新 tag。
2. 点 **一键更新**，在确认框里同意。这会 `POST /api/panel/update`，带上 `confirm: true` 和当前看到的最新 tag。
3. 成功提示是「已开始升级到 &lt;tag&gt;，控制面会短暂中断」。页面随后可能加载失败，这是控制面在重启，不是升级失败。等十几秒再刷新关于页。
4. 若返回 `already_latest`，说明已经在目标版本上。
5. 若错误码是 `host_upgrade_required`，管理台会尝试把宿主机命令复制到剪贴板。到服务器上执行那条命令。它和管理台按钮是同一件事的两条入口，不要两条同时跑。

升完回到关于页，**当前** 应等于你刚升的 tag。

## 方式 B：在宿主机执行

和生产安装同一支脚本，多一个 `upgrade`：

```bash
curl -sSL https://raw.githubusercontent.com/dofastted/vm2api/main/deploy/install.sh | sudo bash -s -- upgrade
```

脚本已经在磁盘上时，不必再 curl：

```bash
sudo bash /opt/vm2api/deploy/install.sh upgrade
sudo bash /opt/vm2api/deploy/install.sh check
sudo bash /opt/vm2api/deploy/install.sh changelog
```

指定 tag（必须是发布过的 tag）：

```bash
sudo bash /opt/vm2api/deploy/install.sh upgrade --version v1.3.131
```

ARM64 宿主机的 `--version` 要带和宿主一致的 `-arm64` 后缀，amd64 则是 `-amd64` 或不带后缀、由 `uname -m` 决定。不要在 amd64 机器上写 `-arm64`。

目录里有 `.git` 时，`upgrade` 走源码分支而不是只拉镜像。生产机不要留一个用来改代码的 git 检出，除非你就是要 `--from-source`。

## 脚本实际做了什么

1. 拉新的控制面镜像，重新 `up -d` 控制面容器 `vm2api`。
2. 不覆盖 `.env` 里已有的非空字段，不删 `vms/` 和 `data/`。
3. 默认同步新的 `share/wrap-cli`（含 `kin-kernel.bin`）到所有槽，并重启槽内数据面。
4. 不 `docker rm` 槽。容器 ID、出口绑定、`credentials.json` 都还在。

这一小段时间还要用旧内核时：

```bash
sudo bash /opt/vm2api/deploy/install.sh upgrade --no-sync-wrap
```

之后到 [内核](./console/kernel) 页再同步。Changelog 标了 `wrap-cli/sync` 就不要长期停在 `--no-sync-wrap`，否则控制面和槽内二进制不是同一版。

## 需要重装槽内 kernel 时

关于页或 Changelog 写了 wrap-cli/sync：

1. 控制面先升完，`/health` 恢复 200。
2. 打开 [内核](./console/kernel)。
3. 用发行版 kernel 安装，或上传你自己的二进制（上限 32MB），再同步到选中的槽。
4. 同步会重启槽内数据面，不会删除槽。进行中的请求不会被重放。
5. 回到 [虚拟机](./console/vm)，确认槽仍可调度，官方初装状态没有掉成「未登录」。

控制面重启本身不会替换正在运行的槽内进程。换了 `bin/kin-kernel` 却没同步，新请求仍走旧内核。

## 更新之后的验收

按这个顺序，不要跳：

1. `curl -sS --noproxy '*' http://127.0.0.1:8787/health` 为 200。宿主机探不到就 `docker exec vm2api`。
2. 关于页 **当前** 等于目标 tag，徽章变为「已是最新」。
3. `docker ps` 里 `vm2api` 是新启动的，原来已启动的 `kin-*` 还在，没有被换成另一批名字。
4. 抽一个原来可调度的槽，发一次 `POST /v1/messages`。不要用新密钥做这步，用升级前就能用的那把，这样失败时能分清是升级问题还是密钥问题。
5. 若这跨度要求 wrap-cli/sync，内核页上的样本路径应是新的 `share/wrap-cli`，而不是升级前的旧文件时间。

## 不要做的事

- 不要 `docker rm` 或 `docker compose down -v`。`-v` 会连数据卷一起删。
- 不要在升级过程中改 `VM2API_DB_SECRET`。那是另一件事，会让现有库对不上。
- 不要同时点管理台升级又在 SSH 里跑 `upgrade`。
- 不要因为终端里出现 `native stdin: Broken pipe` 就删槽。先看该槽是不是还卡在 `500m` 内存上限，以及 CLI 子进程是否退出。见 [常见问题](../reference/faq)。

## 更新失败时

| 现象 | 处理 |
| --- | --- |
| 关于页「检查失败」 | 多半是访问 GitHub Release 受限。在 `.env` 配 `GITHUB_TOKEN` 或 `VM2API_GITHUB_TOKEN`，重启控制面后再检查。这个 token 只用于提高 API 限额 |
| 页面一直打不开 | `docker ps` 看 `vm2api` 是否在重启。看 `docker logs vm2api --tail 80`，不要先动槽 |
| 槽还在，调用 502 | 槽内数据面刚重启。等它就绪；若 Changelog 要求同步 kernel 而你用了 `--no-sync-wrap`，去内核页补同步 |
| 官方 CLI 提示未登录 | 到该槽的官方初装再执行一次。升级不应清 `credentials.json`；未登录通常是初装文件没写回，不是账号被删 |

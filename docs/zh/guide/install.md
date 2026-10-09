# 安装

先做完这一页，再打开管理台。更新不要走这条，去 [更新](./upgrade)。

对照的产品树是 **1.3.131**。一键脚本拉的是 GitHub 上的最新 Release，版本号可以比本文新。机器要求不变：Ubuntu 24.04，Docker Engine，Compose V2。Debian 12 上槽内核经常起不来。不要在目标机上编译。

## 做完之后你应该看到

| 检查 | 正常结果 |
| --- | --- |
| `docker ps` | 只有一个 vm2api 容器：`vm2api`。槽还没启动时没有 `kin-*` |
| `GET /health` | HTTP 200 |
| 浏览器 | `http://<主机>:8787/console/#/login` 出现登录页 |
| `.env` | 权限 `600`，三把密钥都不是空的 |

## 第 1 步：确认机器

在准备安装的 Ubuntu 上执行：

```bash
. /etc/os-release && echo "$VERSION_ID"
docker --version
docker compose version
```

`VERSION_ID` 应是 `24.04`。`docker compose version` 必须能跑，不是旧的 `docker-compose` 独立二进制也可以，但要是 Compose V2。当前用户要能跑 Docker；下面的安装命令用 `sudo`。

ARM64（`uname -m` 为 `aarch64`）用同一条安装命令。脚本会选 `-arm64` 控制面镜像并准备 QEMU，槽镜像仍是 amd64。这是实验路径，失败时先看脚本报错，不要手改发行版的 binfmt。

## 第 2 步：决定三把密钥

写进安装目录的 `.env`，权限 `600`，不要进 git。

| 变量 | 你要决定的事 |
| --- | --- |
| `VM2API_ADMIN_USER` | 管理台用户名。不写就是 `admin` |
| `VM2API_ADMIN_PASSWORD` | 管理台密码。**留空时安装器写入 `123456`，已有密码不会被覆盖** |
| `VM2API_API_KEY` | Master 密钥。能调 `/v1/*` 和管理台 API。留空则启动时生成随机值 |
| `VM2API_DB_SECRET` | 数据库密钥。留空则生成。生成之后不要换，除非你准备丢数据 |

端口对公网开放之前，不要把密码留在 `123456`。想自己指定密码，用第 4 步的手动安装，在 `up -d` 之前改 `.env`。一键安装会在密码为空时写上默认值，装完再改也可以：改 `.env` 后 `docker compose up -d` 重启控制面。这不会重建槽，此时也还没有槽。

## 第 3 步：一键安装

```bash
curl -sSL https://raw.githubusercontent.com/dofastted/vm2api/main/deploy/install.sh | sudo bash
```

脚本只下载这三样，不 clone 仓库：

- `docker-compose.yml`
- `.env.example`
- `VERSION`

然后补全 `.env`（`chmod 600`），执行 `docker compose pull` 和 `docker compose up -d`。默认目录是 `/opt/vm2api`。控制面镜像把 `bin/` 和 `share/wrap-cli` 写到挂载目录，并用镜像里的默认值补齐缺的 `src/config`。

装完立刻看容器和健康检查：

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
curl -sS --noproxy '*' http://127.0.0.1:8787/health
```

Docker Desktop 或 WSL 上，宿主机的 `127.0.0.1` 可能探不到端口。改问容器：

```bash
docker exec vm2api python3 -c 'import urllib.request; print(urllib.request.urlopen("http://127.0.0.1:8787/health").read().decode())'
```

## 第 4 步：不用脚本时的手动安装

和一键安装拉的是同一组文件。

```bash
sudo mkdir -p /opt/vm2api && cd /opt/vm2api
sudo curl -sSLO https://raw.githubusercontent.com/dofastted/vm2api/main/docker-compose.yml
sudo curl -sSL -o .env https://raw.githubusercontent.com/dofastted/vm2api/main/.env.example
sudo chmod 600 .env
```

用编辑器填上第 2 步的三把密钥，再启动：

```bash
sudo docker compose pull
sudo docker compose up -d
curl -sS --noproxy '*' http://127.0.0.1:8787/health
```

只有要改源码时才 clone 仓库并加 `docker-compose.build.yml`。那不是生产安装。二进制在仓内 `bin/`，必须是 `755`。

## 第 5 步：看懂容器

Compose **只启动控制面** `vm2api`。它用宿主网络，并挂载宿主的 Docker socket。

| 名字 | 什么时候出现 |
| --- | --- |
| `vm2api` | 安装成功后一直在 |
| `kin-<槽>` | 你在管理台启动一个槽之后，每个已启动槽一个 |
| 没有别的 | 槽位记录在，但没点启动，就没有容器 |

不要指望在 `vm2api` 里面再看到一排子进程槽。槽是旁边独立的容器。原生 Claude 槽新建时内存上限默认 `1g`（`KIN_VM_MEMORY` 只影响新建）。更早创建、仍是 `500m` 的容器不会因为升级控制面自动变大。

## 第 6 步：防火墙

UFW 或 firewalld 默认拒绝入站时，先放行槽的出口网关，再导入账号、发请求。否则槽内请求是 `502 incomplete_response`，管理台里的代理探测却可以是绿的。这两次检查不是同一条路径。

具体放行规则以产品仓库 [DEPLOY.md](https://github.com/dofastted/vm2api/blob/main/docs/DEPLOY.md) 的防火墙一节为准，因为网卡和端口跟你的出口拓扑有关。

要 HTTPS 时，TLS 放在 nginx，反代到 `127.0.0.1:8787`。集群终端和槽位运维终端是 WebSocket：对应 `location` 必须转发 `Upgrade`，并且写在任何设置 `Connection ""` 的 `location` 前面。见 [nginx-shell.md](https://github.com/dofastted/vm2api/blob/main/docs/nginx-shell.md)。

## 第 7 步：登录并改掉默认密码

浏览器打开：

`http://<主机>:8787/console/#/login`

旧文档里的 `/cc#/login` 打不开就用上面这个。当前服务在 `GET /console` 提供管理台。响应体若是 `console not found; run pnpm -C web build`，说明这不是发行镜像，网页没打进包。

用 `VM2API_ADMIN_USER` / `VM2API_ADMIN_PASSWORD` 登录。然后到 [用户](./console/users) 把管理员密码改成至少 8 位。Master 密钥 `VM2API_API_KEY` 不要放进任何客户端，客户端用 [密钥](./console/keys) 页签发的 `sk-vm-…`。

## 第 8 步：出口、槽、第一次调用

还不能调用模型。顺序是：

1. [代理池](./console/proxies)：确认有本地出口 `px-local`，或导入一条 SOCKS5。
2. [导入](./console/import)：创建空槽，绑定出口，再导入 OAuth 或账号文件。没有出口会报 `proxy_required`。
3. Claude 槽等官方初装跑完。同一槽再次导入会重新初装，不会因为上次已经初装过就跳过。
4. 槽显示可调度之后，再发请求。

```bash
curl -sS http://127.0.0.1:8787/v1/messages \
  -H "Authorization: Bearer $VM2API_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-5",
    "max_tokens": 128000,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

最小验收：`/health` 200，带密钥的 `GET /v1/models` 有目录，一次 messages 有可见回答。槽位细节在 [槽位与账号](./slots)。

## 装失败时先看这些

| 现象 | 先做什么 |
| --- | --- |
| 构建日志里 `COPY VERSION` / `CHANGELOG.md not found` | 你在源码模式，工作树不完整。生产安装不要 `--build` |
| 健康检查从宿主机失败、容器里成功 | Docker Desktop / WSL 的回环。用 `docker exec` 那条 |
| 管理台 404 | 没有 `web/dist`。换发行镜像，或在源码树里构建网页 |
| 一导入就 `proxy_required` | 先绑 SOCKS5 或 `px-local` |
| 调用 502、探测却正常 | 看防火墙和槽内 DNS，见 [常见问题](../reference/faq) |

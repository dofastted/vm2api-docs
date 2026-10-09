# 安装

推荐方式：Docker Compose，拉预构建镜像，目录随意。例子用 `/opt/vm2api`。

源码和镜像构建的细节留在产品仓库：[DEPLOY.md](https://github.com/dofastted/vm2api/blob/main/docs/DEPLOY.md)、[ARM64.md](https://github.com/dofastted/vm2api/blob/main/docs/ARM64.md)、[BUILD.md](https://github.com/dofastted/vm2api/blob/main/docs/BUILD.md)。

## 条件

- Ubuntu 24.04，以及带 Compose V2 的 Docker Engine。
- `.env` 里三个值，权限 `600`，不要提交进 git：

```bash
VM2API_API_KEY='一长串随机字符'
VM2API_ADMIN_PASSWORD='管理台密码'
VM2API_DB_SECRET='另一串随机字符'
```

两边都设置时，`VM2API_*` 优先于旧的 `KIN_*`。

## 一条命令

```bash
curl -sSL https://raw.githubusercontent.com/dofastted/vm2api/main/deploy/install.sh | sudo bash
```

脚本落到磁盘之后，常用的后续命令：

```bash
sudo bash /opt/vm2api/deploy/install.sh upgrade
sudo bash /opt/vm2api/deploy/install.sh upgrade --version v1.3.131
sudo bash /opt/vm2api/deploy/install.sh check
sudo bash /opt/vm2api/deploy/install.sh changelog
```

管理台 **设置 → 关于** 可以复制同一条更新命令。

## 手动 Compose

```bash
mkdir -p /opt/vm2api && cd /opt/vm2api
curl -sSLO https://raw.githubusercontent.com/dofastted/vm2api/main/docker-compose.yml
curl -sSL -o .env https://raw.githubusercontent.com/dofastted/vm2api/main/.env.example
chmod 600 .env
# 写上三个密钥。空的 API key 和 DB secret 会在启动时生成。
docker compose pull
docker compose up -d
curl -sS --noproxy '*' http://127.0.0.1:8787/health
```

镜像入口会把 `bin/` 和 `share/wrap-cli` 写到挂载目录，并用镜像内的默认值补齐 `src/config` 里缺的文件。

## 应该看到哪些容器

| 容器 | 何时存在 |
| --- | --- |
| `vm2api` | 始终。Compose 只启动这一个。 |
| `kin-<槽>` | 每个**已启动**的槽位一个。 |
| 没有别的 vm2api 容器 | 槽位存在但没启动时，没有对应容器。 |

控制面使用宿主网络和宿主 Docker socket。原生 Claude 槽新建时默认内存上限 `1g`（`KIN_VM_MEMORY` 覆盖新建容器的值）。提高已有容器的上限：

```bash
docker update --memory 1g --memory-swap 1g kin-<槽>
```

这不会重建容器。

`native stdin: Broken pipe` 时要同时看 OOM 和 CLI 子进程。Rust 的 PID 1 还活着并不够。

## 从源码

只有在你要改这棵树的时候：

```bash
git clone https://github.com/dofastted/vm2api.git /opt/vm2api
cd /opt/vm2api && cp .env.example .env && chmod 600 .env
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
```

一键脚本对应的参数是 `--from-source`。目录里已经有 `.git` 时，`upgrade` 走源码分支。`bin/` 里的二进制必须是 `755`。

## ARM64

安装命令相同。`uname -m` 为控制面选择 `vX.Y.Z-arm64`，并准备 QEMU，让现有 amd64 槽镜像继续跑。`--version` 可以以 `-amd64` 或 `-arm64` 结尾，且必须和宿主一致。这条路径是实验性的。

## 防火墙

UFW 或 firewalld 默认拒绝入站时，先放行槽出口网关再发请求。否则槽内请求会返回 `502 incomplete_response`，而管理台的代理探测看起来仍正常。具体规则在产品 [DEPLOY.md](https://github.com/dofastted/vm2api/blob/main/docs/DEPLOY.md) 的防火墙一节。

## HTTPS

进程监听 `:8787`。TLS 放在 nginx。集群终端和槽位运维终端是 WebSocket。它们的 `location` 必须转发 `Upgrade`，并且写在任何设置 `Connection ""` 的 `location` **前面**。见 [nginx-shell.md](https://github.com/dofastted/vm2api/blob/main/docs/nginx-shell.md)。

# 快速开始

Ubuntu 24.04，已安装 Docker Engine。Debian 12 上槽内核经常起不来。安装器拉取预构建镜像，不在服务器上编译。

## 1. 安装

```bash
curl -sSL https://raw.githubusercontent.com/dofastted/vm2api/main/deploy/install.sh | sudo bash
```

脚本下载 `docker-compose.yml`、`.env.example` 和 `VERSION`，补全空的 `.env`（`chmod 600`），然后执行 `docker compose pull` 和 `up -d`。

`VM2API_ADMIN_PASSWORD` 为空时，管理台账号是 **`admin` / `123456`**。已经写过的密码不会被覆盖。空的 `VM2API_API_KEY` 和 `VM2API_DB_SECRET` 会生成随机值。

端口对公网开放之前，先改掉管理台密码。

ARM64 主机用同一条命令。脚本会选择 `-arm64` 控制面镜像并准备 QEMU。槽位镜像仍是 amd64。这条路径是实验性的，见 [安装](./install)。

## 2. 检查控制面

Compose 只启动一个容器：`vm2api`。槽容器稍后才出现，名字是 `kin-<槽>`，而且只有在你启动槽位之后才有。

```bash
curl -sS --noproxy '*' http://127.0.0.1:8787/health
```

Docker Desktop 或 WSL 上，宿主机的 `127.0.0.1` 可能探不到这个端口。改问容器：

```bash
docker exec vm2api python3 -c 'import urllib.request; print(urllib.request.urlopen("http://127.0.0.1:8787/health").read().decode())'
```

## 3. 打开管理台

[http://127.0.0.1:8787/console/#/login](http://127.0.0.1:8787/console/#/login)

旧部署说明写的是 `http://<主机>:8787/cc#/login`。如果那个地址 404，改用 `/console/#/login`。当前服务在 `GET /console` 提供构建好的管理台。

## 4. 先加出口，再加账号

槽位在有可用出口之前不会导入凭证：远程 SOCKS5，或本地出口 `px-local`。首次启动可能会种下 `px-local`。

然后导入账号（OAuth 或账号文件），Claude 槽再跑官方初装。细节在 [槽位与账号](./slots)。

## 5. 调用

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

`VM2API_API_KEY` 是 `.env` 里的 Master 密钥。它可以调用 `/v1/*` 和管理台 API。在管理台签发的密钥（`sk-vm-…`）只能调用 `/v1/*`。

## 以后更新

```bash
curl -sSL https://raw.githubusercontent.com/dofastted/vm2api/main/deploy/install.sh | sudo bash -s -- upgrade
```

更新会保留 `.env`、`vms/` 和 `data/`。不要为了升级去 `docker rm` 槽容器。脚本会把 `share/wrap-cli`（含 `kin-kernel.bin`）同步进正在运行的槽，并重启槽内数据面。`--no-sync-wrap` 会跳过这次同步。

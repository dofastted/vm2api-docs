# Install

Recommended layout: Docker Compose, prebuilt images, any directory. Examples use `/opt/vm2api`.

Source and image build notes stay in the product repository: [DEPLOY.md](https://github.com/dofastted/vm2api/blob/main/docs/DEPLOY.md), [ARM64.md](https://github.com/dofastted/vm2api/blob/main/docs/ARM64.md), [BUILD.md](https://github.com/dofastted/vm2api/blob/main/docs/BUILD.md).

## Requirements

- Ubuntu 24.04 and Docker Engine with Compose V2.
- Three values in `.env`, mode `600`, not committed:

```bash
VM2API_API_KEY='long random string'
VM2API_ADMIN_PASSWORD='console password'
VM2API_DB_SECRET='another random string'
```

`VM2API_*` wins over the older `KIN_*` names.

## One command

```bash
curl -sSL https://raw.githubusercontent.com/dofastted/vm2api/main/deploy/install.sh | sudo bash
```

Useful follow-ups, once `deploy/install.sh` is on disk:

```bash
sudo bash /opt/vm2api/deploy/install.sh upgrade
sudo bash /opt/vm2api/deploy/install.sh upgrade --version v1.3.131
sudo bash /opt/vm2api/deploy/install.sh check
sudo bash /opt/vm2api/deploy/install.sh changelog
```

The console page **Settings → About** can copy the same upgrade command.

## Manual Compose

```bash
mkdir -p /opt/vm2api && cd /opt/vm2api
curl -sSLO https://raw.githubusercontent.com/dofastted/vm2api/main/docker-compose.yml
curl -sSL -o .env https://raw.githubusercontent.com/dofastted/vm2api/main/.env.example
chmod 600 .env
# Set the three secrets. Empty API key and DB secret are generated on start.
docker compose pull
docker compose up -d
curl -sS --noproxy '*' http://127.0.0.1:8787/health
```

The image entrypoint writes `bin/` and `share/wrap-cli` onto the mounted directory, and fills missing files under `src/config` from the image defaults.

## What should be running

| Container | When |
| --- | --- |
| `vm2api` | Always. Compose starts only this one. |
| `kin-<slot>` | One per **started** slot. |
| nothing else from vm2api | A slot that exists but is not started has no container. |

The control plane uses the host network and the host Docker socket. A native Claude slot defaults to a `1g` memory cap (`KIN_VM_MEMORY` overrides it for new containers). Raising the cap on an existing container is `docker update --memory 1g --memory-swap 1g kin-<slot>`. That does not recreate it.

`native stdin: Broken pipe` means you also check OOM and the CLI child. A live Rust PID 1 is not enough.

## From source

Only when you are changing the tree:

```bash
git clone https://github.com/dofastted/vm2api.git /opt/vm2api
cd /opt/vm2api && cp .env.example .env && chmod 600 .env
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
```

The one-click script's matching flag is `--from-source`. If the directory already has `.git`, `upgrade` follows the source branch. Binaries in `bin/` must be mode `755`.

## ARM64

Same install command. `uname -m` selects `vX.Y.Z-arm64` for the control plane and prepares QEMU so existing amd64 slot images still run. `--version` may end in `-amd64` or `-arm64`, and it must match the host. This path is experimental.

## Firewall

If UFW or firewalld denies inbound by default, open the slot egress gateway before you send traffic. Otherwise slot requests return `502 incomplete_response` while the console proxy probe still looks healthy. The exact rules are in the product [DEPLOY.md](https://github.com/dofastted/vm2api/blob/main/docs/DEPLOY.md) firewall section.

## HTTPS

The process listens on `:8787`. Put TLS on nginx. Cluster shells and the per-slot ops terminal are WebSockets. Their `location` must pass `Upgrade` and must be **before** any `location` that sets `Connection ""`. See [nginx-shell.md](https://github.com/dofastted/vm2api/blob/main/docs/nginx-shell.md).

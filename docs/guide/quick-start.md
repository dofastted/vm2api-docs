# Quick Start

Ubuntu 24.04 with Docker Engine. Debian 12 often fails to start the slot kernel. The installer pulls a prebuilt image. It does not compile on the server.

## 1. Install

```bash
curl -sSL https://raw.githubusercontent.com/dofastted/vm2api/main/deploy/install.sh | sudo bash
```

The script downloads `docker-compose.yml`, `.env.example`, and `VERSION`, fills an empty `.env` (`chmod 600`), then runs `docker compose pull` and `up -d`.

If `VM2API_ADMIN_PASSWORD` is empty, the console user is **`admin` / `123456`**. An existing password is left alone. Empty `VM2API_API_KEY` and `VM2API_DB_SECRET` are generated.

Change the console password before the port is reachable from the internet.

ARM64 hosts use the same command. The script selects the `-arm64` control-plane image and prepares QEMU. Slot images stay amd64. That path is experimental. See [Install](./install).

## 2. Check the control plane

Compose starts one container, `vm2api`. Slot containers appear later, named `kin-<slot>`, and only after you start a slot.

```bash
curl -sS --noproxy '*' http://127.0.0.1:8787/health
```

On Docker Desktop or WSL, `127.0.0.1` from the host can miss the port. Ask the container instead:

```bash
docker exec vm2api python3 -c 'import urllib.request; print(urllib.request.urlopen("http://127.0.0.1:8787/health").read().decode())'
```

## 3. Open the console

[http://127.0.0.1:8787/console/#/login](http://127.0.0.1:8787/console/#/login)

Older deploy notes use `http://<host>:8787/cc#/login`. If that 404s, use `/console/#/login`. The current server serves the built console at `GET /console`.

## 4. Add an exit, then an account

A slot will not import a credential until it has a usable egress: a remote SOCKS5 proxy, or the local exit `px-local`. The first boot can seed `px-local`.

Then import the account (OAuth or an account file) and run the official first-time setup for a Claude slot. Details are in [Slots and accounts](./slots).

## 5. Call it

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

`VM2API_API_KEY` is the master key from `.env`. It may call `/v1/*` and the panel API. Keys you issue in the console (`sk-vm-…`) may call `/v1/*` only.

## Update later

```bash
curl -sSL https://raw.githubusercontent.com/dofastted/vm2api/main/deploy/install.sh | sudo bash -s -- upgrade
```

The upgrade keeps `.env`, `vms/`, and `data/`. Do not `docker rm` slot containers to upgrade. The script syncs `share/wrap-cli` (including `kin-kernel.bin`) into running slots and restarts the dataplane inside them. `--no-sync-wrap` skips that sync.

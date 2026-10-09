# Install

Finish this page before you open the console. An existing machine uses [Update](./upgrade), not this page.

These steps match product tree **1.3.131**. The one-click script pulls the latest GitHub release, which may be newer. The machine does not change: Ubuntu 24.04, Docker Engine, Compose V2. Debian 12 often fails to start the slot kernel. Do not compile on the target host.

## What done looks like

| Check | Expected |
| --- | --- |
| `docker ps` | One vm2api container, named `vm2api`. No `kin-*` until you start a slot |
| `GET /health` | HTTP 200 |
| Browser | Login form at `http://<host>:8787/console/#/login` |
| `.env` | Mode `600`, all three secrets non-empty |

## Step 1: Check the machine

```bash
. /etc/os-release && echo "$VERSION_ID"
docker --version
docker compose version
```

`VERSION_ID` should be `24.04`. `docker compose version` must work. The user running the install needs Docker; the commands below use `sudo`.

ARM64 (`uname -m` is `aarch64`) uses the same install command. The script selects the `-arm64` control-plane image and prepares QEMU. Slot images stay amd64. That path is experimental. Read the script error before editing the distro binfmt files.

## Step 2: Choose the three secrets

They live in `.env` in the install directory, mode `600`, not in git.

| Variable | What you decide |
| --- | --- |
| `VM2API_ADMIN_USER` | Console user. Default `admin` |
| `VM2API_ADMIN_PASSWORD` | Console password. **Empty becomes `123456`. An existing password is not overwritten** |
| `VM2API_API_KEY` | Master key. Calls `/v1/*` and the panel API. Empty is generated |
| `VM2API_DB_SECRET` | Database secret. Empty is generated. Do not rotate it later unless you are discarding the database |

Do not leave `123456` in place once port 8787 is reachable from the internet. To choose the password yourself, use the manual install in step 4 and edit `.env` before `up -d`. After a one-click install you can still edit `.env` and `docker compose up -d`. That restarts the control plane only. There is no slot yet.

## Step 3: One-click install

```bash
curl -sSL https://raw.githubusercontent.com/dofastted/vm2api/main/deploy/install.sh | sudo bash
```

The script downloads three files and does not clone the repo:

- `docker-compose.yml`
- `.env.example`
- `VERSION`

It fills `.env` (`chmod 600`), then `docker compose pull` and `docker compose up -d`. The default directory is `/opt/vm2api`. The image entrypoint writes `bin/` and `share/wrap-cli` onto the mount and fills missing `src/config` files from image defaults.

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
curl -sS --noproxy '*' http://127.0.0.1:8787/health
```

On Docker Desktop or WSL the host loopback can miss the port:

```bash
docker exec vm2api python3 -c 'import urllib.request; print(urllib.request.urlopen("http://127.0.0.1:8787/health").read().decode())'
```

## Step 4: Manual install, same artifacts

```bash
sudo mkdir -p /opt/vm2api && cd /opt/vm2api
sudo curl -sSLO https://raw.githubusercontent.com/dofastted/vm2api/main/docker-compose.yml
sudo curl -sSL -o .env https://raw.githubusercontent.com/dofastted/vm2api/main/.env.example
sudo chmod 600 .env
```

Fill the three secrets from step 2, then:

```bash
sudo docker compose pull
sudo docker compose up -d
curl -sS --noproxy '*' http://127.0.0.1:8787/health
```

Clone the repo and add `docker-compose.build.yml` only when you are changing source. That is not the production install. Binaries in `bin/` must be mode `755`.

## Step 5: Which containers exist

Compose starts **only** the control plane, `vm2api`. It uses the host network and the host Docker socket.

| Name | When it exists |
| --- | --- |
| `vm2api` | After a successful install, for the life of the deployment |
| `kin-<slot>` | One per slot you have started in the console |
| nothing else | A slot record with no start has no container |

Slots are not child processes inside `vm2api`. A new native Claude slot defaults to a `1g` memory cap (`KIN_VM_MEMORY` applies to creation). An older container still on `500m` does not grow because the control plane was upgraded.

## Step 6: Firewall and TLS

If UFW or firewalld denies inbound by default, open the slot egress gateway before you import an account or send traffic. Otherwise slot calls return `502 incomplete_response` while the console proxy probe stays green. Those are different checks.

The exact allow rules are in the product [DEPLOY.md](https://github.com/dofastted/vm2api/blob/main/docs/DEPLOY.md) firewall section, because they follow your egress topology.

For HTTPS, terminate TLS in nginx and proxy to `127.0.0.1:8787`. Cluster shells and the per-slot ops terminal are WebSockets. Their `location` must forward `Upgrade` and must be listed before any `location` that sets `Connection ""`. See [nginx-shell.md](https://github.com/dofastted/vm2api/blob/main/docs/nginx-shell.md).

## Step 7: Sign in and replace the default password

Open:

`http://<host>:8787/console/#/login`

If an older note's `/cc#/login` 404s, use the URL above. The server serves the console at `GET /console`. A body of `console not found; run pnpm -C web build` means this is not a release image.

Sign in with `VM2API_ADMIN_USER` / `VM2API_ADMIN_PASSWORD`. Then on [Users](./console/users) set the admin password to at least 8 characters. Do not put the master key `VM2API_API_KEY` in a client. Issue an `sk-vm-…` key on [Keys](./console/keys).

## Step 8: Egress, a slot, the first call

The model is not callable yet. Order:

1. [Proxy pool](./console/proxies): keep the seeded local exit `px-local`, or import a SOCKS5 proxy.
2. [Import](./console/import): create an empty slot, bind the exit, then import OAuth or an account file. No exit returns `proxy_required`.
3. Wait for official first-time setup on a Claude slot. Importing again on the same slot runs setup again.
4. Send traffic only after the slot is schedulable.

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

Minimum acceptance: `/health` is 200, `GET /v1/models` with a key returns a catalog, one messages call returns visible text. Slot rules are in [Slots and accounts](./slots).

## If install fails

| What you see | Do this first |
| --- | --- |
| `COPY VERSION` / `CHANGELOG.md not found` | You are in a source build with an incomplete tree. Production install does not `--build` |
| Health fails on the host and works inside the container | Docker Desktop / WSL loopback. Use `docker exec` |
| Console 404 | No `web/dist`. Use a release image, or build the web app in a source tree |
| `proxy_required` on import | Bind SOCKS5 or `px-local` first |
| Calls 502 while the probe is green | Firewall or DNS inside the slot. See [FAQ](../reference/faq) |

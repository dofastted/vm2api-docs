# Update

Use this page for a machine that is already running. A new machine uses [Install](./install).

An update **keeps** `.env`, `vms/`, and `data/`. Do not `docker rm` slot containers to upgrade. The control plane can drop offline for a short time. Slot credential files stay where they are.

## Before you start

1. Open **Settings → About**: `http://<host>:8787/console/#/settings/about`. The same controls are described in [Settings](./settings#about).
2. Compare **current** and **latest on GitHub**. Stop if the badge says you are up to date.
3. Read the changelog for this gap. A `wrap-cli/sync` badge means the slot kernel must be synced after the control plane is up. Restarting the `vm2api` container does not replace a kernel that is already running inside a slot.
4. Confirm the host can still run `docker` and `sudo`. The console button sometimes only copies a host command. The image pull happens on the host.

## Path A: one click in the console

On **About**:

1. Click **Check for updates** and confirm the latest tag.
2. Click the one-click update and accept the confirm dialog. That is `POST /api/panel/update` with `confirm: true` and the latest tag you are looking at.
3. Success means the upgrade to that tag has started and the control plane will blip. A failed page load right after that is the restart, not a failed upgrade. Refresh About after several seconds.
4. `already_latest` means you are already on the target.
5. Error code `host_upgrade_required` means the console tried to copy the host command. Run that command over SSH. Do not also click the button again while it is running.

When it finishes, **current** on About equals the tag you just installed.

## Path B: on the host

Same script as install, with `upgrade`:

```bash
curl -sSL https://raw.githubusercontent.com/dofastted/vm2api/main/deploy/install.sh | sudo bash -s -- upgrade
```

If the script is already on disk:

```bash
sudo bash /opt/vm2api/deploy/install.sh upgrade
sudo bash /opt/vm2api/deploy/install.sh check
sudo bash /opt/vm2api/deploy/install.sh changelog
```

Pin a published tag:

```bash
sudo bash /opt/vm2api/deploy/install.sh upgrade --version v1.3.131
```

On ARM64 the `--version` suffix must be `-arm64`. On amd64 use `-amd64` or omit the suffix and let `uname -m` choose. Do not pass `-arm64` on an amd64 host.

If the directory contains `.git`, `upgrade` follows the source branch instead of only pulling an image. A production host should not be a checkout you edit, unless you meant `--from-source`.

## What the script does

1. Pulls the new control-plane image and recreates the `vm2api` container with `up -d`.
2. Does not overwrite non-empty `.env` fields. Does not delete `vms/` or `data/`.
3. Syncs the new `share/wrap-cli`, including `kin-kernel.bin`, into every slot and restarts the dataplane inside the slot.
4. Does not `docker rm` slots. Container id, egress binding, and `credentials.json` remain.

To keep the previous in-slot kernel for one window:

```bash
sudo bash /opt/vm2api/deploy/install.sh upgrade --no-sync-wrap
```

Sync later from the [Kernel](./console/kernel) page. Do not stay on `--no-sync-wrap` after a changelog row marked `wrap-cli/sync`. The control plane and the slot binary would be different builds.

## When the slot kernel must be reinstalled

If About or the changelog says wrap-cli/sync:

1. Finish the control-plane upgrade. `/health` is 200 again.
2. Open [Kernel](./console/kernel).
3. Install the release kernel, or upload your own binary (32MB cap), then sync the slots you selected.
4. Sync restarts the in-slot dataplane. It does not delete the slot. In-flight requests are not replayed.
5. On [Virtual machines](./console/vm), confirm the slot is still schedulable and official setup did not fall back to "not logged in".

A control-plane restart alone does not replace a running in-slot process. A new `bin/kin-kernel` that was never synced is unused.

## Acceptance

Do these in order:

1. `curl -sS --noproxy '*' http://127.0.0.1:8787/health` is 200. If the host cannot see the port, use `docker exec vm2api`.
2. About shows **current** equal to the target tag.
3. `docker ps` still has `vm2api` and the same `kin-*` names that were running before. They were not replaced by a new set of names.
4. Send one `POST /v1/messages` with a key that worked before the upgrade. A new key hides whether the failure is the upgrade.
5. If this gap required wrap-cli/sync, the kernel page should show the new `share/wrap-cli` sample, not the previous file time.

## Do not

- Do not `docker rm` slots or `docker compose down -v`. `-v` deletes volumes.
- Do not change `VM2API_DB_SECRET` as part of an upgrade. That is a different operation and the existing database will not match.
- Do not click the console upgrade and run `upgrade` over SSH at the same time.
- Do not delete a slot because the log says `native stdin: Broken pipe`. Check the `500m` memory cap and whether the CLI child exited. See [FAQ](../reference/faq).

## If the update fails

| What you see | What to do |
| --- | --- |
| About says the check failed | GitHub release API is rate-limited. Set `GITHUB_TOKEN` or `VM2API_GITHUB_TOKEN` in `.env`, restart the control plane, check again. The token is only for the rate limit |
| The console stays down | `docker ps` and `docker logs vm2api --tail 80`. Do not touch slots first |
| Slots exist, calls return 502 | The in-slot dataplane just restarted. If the changelog required a kernel sync and you passed `--no-sync-wrap`, sync from the kernel page |
| Official CLI says it is not logged in | Run official setup again on that slot. An upgrade does not delete `credentials.json`. "Not logged in" usually means the setup files were not written back |

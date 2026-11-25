# Quick Start

On a new machine, do these in order. Do not start from the console.

1. [Install](./install). Ubuntu 24.04, the one-click script, the health check, and replacing the default password. That page is the step-by-step, including the manual path and the firewall.
2. [Import](./console/import). An empty slot, an exit, an account, official setup.
3. [Call the API](./api). `POST /v1/messages` with an `sk-vm-…` key or the master key. Wire Claude Code, Codex, or an SDK on [Connect clients](./clients).

A machine that is already running, and you only want a newer release: do not reinstall. Use [Update](./upgrade). An update keeps `.env`, `vms/`, and `data/`, and it does not `docker rm` slots.

To move onto the next-generation kernel, do not reinstall the machine from this page. After the control plane is up, install or switch selected slots from [Next-generation kernel](./console/next-kernel).

Every console screen is listed in the [page map](./console). Every settings tab is in [Settings](./settings).

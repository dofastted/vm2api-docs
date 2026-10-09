# Quick Start

On a new machine, do these in order. Do not start from the console.

1. [Install](./install). Ubuntu 24.04, the one-click script, the health check, and replacing the default password. That page is the step-by-step, including the manual path and the firewall.
2. [Import](./console/import). An empty slot, an exit, an account, official setup.
3. [Call the API](./api). `POST /v1/messages` with an `sk-vm-…` key or the master key.

A machine that is already running, and you only want a newer release: do not reinstall. Use [Update](./upgrade). An update keeps `.env`, `vms/`, and `data/`, and it does not `docker rm` slots.

Every console screen is listed in the [page map](./console). Every settings tab is in [Settings](./settings).

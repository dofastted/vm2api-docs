# Import

`http://<host>:8787/console/#/import`

Two tabs: **Create vm**, then write an account onto an empty slot. Do not reverse that order.

## Create vm

You need a slot that does not have a credential yet. The image choices match the create dialog: Ubuntu 24.04, Debian 12, Arch, Fedora, or a custom kernel. Creating the record does not mean the official client is already running. The container appears when you start the slot.

## Three steps to write the account

1. **Pick an empty slot.** The list is only virtual machines that still have no credential. A slot that already has an account is refreshed or set up again from its own detail page, not from here.
2. **Bind SOCKS5.** You cannot continue without an exit. Pick one from the pool, or paste a new line. Pasting replaces the binding this slot already had. The local exit `px-local` has no SOCKS URL. The control plane uses the host route.

   ::: tip No exit yet?
   [ProxyLane](https://proxylane.dev/go/vm2api-docs) native static residential ISP IPs for Claude Max: a dedicated IP with unlimited traffic. Paste its `host:port:user:pass` line here, see [Proxy pool](./proxies). Code `VM2API30` gives 30% off your first purchase.
   :::
3. **Exchange or import a file.**
   - Claude: OAuth. Live tokens are written only to that slot's `credentials.json`.
   - GPT: Codex OAuth, or an `auth.json` account file. Do not put a Setup Token or a Console Key on a GPT slot.

Production ignores `require_proxy: false`. No binding is `proxy_required`.

## After import

A Claude slot queues official setup when `routing.official_cc` says so. The default is automatic. Setup writes the official login file, runs hello, and reads usage. That traffic still uses the slot's exit. The VPS does not dial Anthropic on its own for that slot.

A dead credential leaves the pool and drops stickiness. An expired token with no refresh token is not scheduled. A successful import whose "available" switch is off is still not picked. Turn the switch on from the virtual-machine page.

## Gemini

**Import → Gemini** is a Gemini environment on the host. It does not create a slot and it does not enter virtual-machine scheduling. You can enter a Google OAuth code, a callback link, or a Gemini API key.

After a refresh, the page shows only the account, project, subscription, models, quota, and credits the upstream actually returned. API-key mode reads models only. A field that was not returned is not shown as zero.

A Gemini-only key is separate from Claude and Codex call scope. This release does not open Gemini inference to callers and does not bill it. The account holder still has to finish consent and token exchange.

Linux amd64 hosts only. The panel separates "service not connected", "no install source", and "signature check failed". Do not treat those as one "not installed" state.

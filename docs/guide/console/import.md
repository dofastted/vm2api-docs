# Import

`http://<host>:8787/console/#/import`

Two tabs: **Create vm**, then write an account onto an empty slot. Do not reverse that order.

## Create vm

You need a slot that does not have a credential yet. The image choices match the create dialog: Ubuntu 24.04, Debian 12, Arch, Fedora, or a custom kernel. Creating the record does not mean the official client is already running. The container appears when you start the slot.

## Three steps to write the account

1. **Pick an empty slot.** The list is only virtual machines that still have no credential. A slot that already has an account is refreshed or set up again from its own detail page, not from here.
2. **Bind SOCKS5.** You cannot continue without an exit. Pick one from the pool, or paste a new line. Pasting replaces the binding this slot already had. The local exit `px-local` has no SOCKS URL. The control plane uses the host route.
3. **Exchange or import a file.**
   - Claude: OAuth. Live tokens are written only to that slot's `credentials.json`.
   - GPT: Codex OAuth, or an `auth.json` account file. Do not put a Setup Token or a Console Key on a GPT slot.

Production ignores `require_proxy: false`. No binding is `proxy_required`.

## After import

A Claude slot queues official setup when `routing.official_cc` says so. The default is automatic. Setup writes the official login file, runs hello, and reads usage. That traffic still uses the slot's exit. The VPS does not dial Anthropic on its own for that slot.

A dead credential leaves the pool and drops stickiness. An expired token with no refresh token is not scheduled. A successful import whose "available" switch is off is still not picked. Turn the switch on from the virtual-machine page.

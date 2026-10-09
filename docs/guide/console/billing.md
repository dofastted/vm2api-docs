# Billing

`http://<host>:8787/console/#/billing`

Spend is totaled two ways. The buttons on the right switch them.

- **By virtual machine.** Then all, Claude, or GPT. Claude and GPT are separate upstream bills.
- **By key.** Which `sk-vm-…` spent the most. The platform filter is hidden in this mode. The number is that key across platforms.

These figures are what the gateway stored on request logs. They are not the invoice in the Anthropic or OpenAI console. Reconcile against the official bill. A request that was not logged does not appear here.

For one day or one model, use the key stats dialog or a log export. This page does not edit prices and it has no top-up.

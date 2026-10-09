---
layout: home

hero:
  name: vm2api
  text: Subscriptions, as a standard API.
  tagline: A fully isolated VM-level gateway. Official Claude Code and ChatGPT clients run inside their own slots and speak OpenAI and Anthropic protocols.
  actions:
    - theme: brand
      text: What is vm2api?
      link: /guide/what-is
    - theme: alt
      text: Quick Start
      link: /guide/quick-start
    - theme: alt
      text: GitHub
      link: https://github.com/dofastted/vm2api

features:
  - title: Official client, not a fake HTTP stack
    details: Each slot runs the real Claude Code process. Credentials stay on that slot. The gateway does not invent a third-party client fingerprint.
  - title: One protocol in, the models you already pay for
    details: Call /v1/messages, /v1/chat/completions, or /v1/responses. Upstream is the subscription behind the slot you imported.
  - title: One slot, one egress
    details: Bind a SOCKS5 proxy or the local egress before importing an account. Traffic for that account leaves through that exit.
  - title: Zero prompt injection
    details: Identity is aligned at the credential layer. The zero layout does not prepend a fake system persona. official and official_full remain available.
  - title: Keys and quotas
    details: The master key can run the panel. Issued sk-vm- keys can only call /v1. Per-slot concurrency and 5h / 7d windows follow the upstream budget.
  - title: Console included
    details: Slots, proxy pool, model policy, request logs, and cluster nodes live in the web console on port 8787.
---

<script setup>
const code = `curl -sS http://127.0.0.1:8787/v1/messages \\
  -H "Authorization: Bearer $VM2API_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "claude-sonnet-5",
    "max_tokens": 128000,
    "messages": [{"role":"user","content":"Hello"}]
  }'`
</script>

<HomeShowcase
  eyebrow="Call"
  title="A normal API in front. A real client behind it."
  body="Point any Anthropic or OpenAI compatible client at port 8787. The control plane picks a schedulable slot, the slot's official client talks upstream through that slot's egress, and the caller gets the protocol it sent."
  file="messages.sh"
  :code="code"
  cta-title="Install it on Ubuntu 24.04"
  cta-text="Quick Start"
  cta-link="/guide/quick-start"
/>

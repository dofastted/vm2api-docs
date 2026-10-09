---
layout: home

hero:
  name: vm2api
  text: 订阅，变成标准 API。
  tagline: 全隔离的虚拟机级网关。官方 Claude Code 与 ChatGPT 客户端跑在各自槽位里，对外提供 OpenAI 与 Anthropic 协议。
  actions:
    - theme: brand
      text: 什么是 vm2api
      link: /zh/guide/what-is
    - theme: alt
      text: 快速开始
      link: /zh/guide/quick-start
    - theme: alt
      text: GitHub
      link: https://github.com/dofastted/vm2api

features:
  - title: 官方客户端，不是伪造的 HTTP 栈
    details: 每个槽位运行真实的 Claude Code 进程。凭证留在该槽。网关不另造一套第三方客户端指纹。
  - title: 一种入站协议，用你已经付费的模型
    details: 调用 /v1/messages、/v1/chat/completions 或 /v1/responses。上游是你导入的那个槽位背后的订阅。
  - title: 一个槽位，一个出口
    details: 导入账号前先绑定 SOCKS5 或本地出口。该账号的流量从这条出口离开。
  - title: 零提示词注入
    details: 身份在凭证层对齐。zero 布局不预置假系统人设。仍可切换 official 与 official_full。
  - title: 密钥与配额
    details: Master 密钥可以操作管理台。签发的 sk-vm- 密钥只能调用 /v1。槽位并发和 5 小时 / 7 天窗口跟随上游额度。
  - title: 自带管理台
    details: 槽位、代理池、模型策略、请求日志和集群节点都在 8787 端口的网页控制台里。
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
  eyebrow="调用"
  title="前面是普通 API，后面是真实客户端。"
  body="把任何兼容 Anthropic 或 OpenAI 的客户端指到 8787。控制面挑选可调度的槽位，槽内官方客户端经该槽出口访问上游，调用方收到自己发出的那种协议。"
  file="messages.sh"
  :code="code"
  cta-title="在 Ubuntu 24.04 上安装"
  cta-text="快速开始"
  cta-link="/zh/guide/quick-start"
/>

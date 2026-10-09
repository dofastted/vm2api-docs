# 导入

`http://<主机>:8787/console/#/import`

两个标签：**创建 vm**，以及给空槽写入账号。顺序不能反。

## 创建 vm

先有一台还没有凭证的空槽。模板和创建对话框里的系统镜像一致，常见的是 Ubuntu 24.04、Debian 12、Arch、Fedora，也可以指定自定义内核。创建不等于已经在跑官方客户端。容器要等你启动槽才出现。

## 写入账号，三步

1. **选一台空槽。** 列表里只有还没有凭证的虚拟机。已经有账号的槽不在这里改票，去该槽详情里刷新或重新初装。
2. **绑 SOCKS5。** 没有出口不能继续。选代理池里的一条，或粘贴新的一行，粘贴会盖掉这条槽上原来的绑定。本地出口 `px-local` 没有 SOCKS URL，控制面走宿主默认路由。
3. **换票或导入文件。**
   - Claude：OAuth。活票只写进该槽的 `credentials.json`。
   - GPT：Codex OAuth，或账号文件 `auth.json`。不要把 Setup Token / Console Key 填到 GPT 槽。

生产环境忽略 `require_proxy: false`。没绑出口就是 `proxy_required`。

## 导入之后

Claude 槽按 `routing.official_cc` 排队做官方初装，默认自动。初装会写官方登录文件、跑 hello、读额度。这一步走的仍是该槽的出口，不是 VPS 直连 Anthropic。

死凭证会出池并拆掉粘性。没有 refresh token 的过期票不会被调度。导入成功但「可用」是关的，调度仍不会选它，到虚拟机页把开关打开。

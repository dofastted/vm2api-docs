# system 提示词

`http://<主机>:8787/console/#/system`

编辑人设模板，并预览最终会不会注入到出站请求里。官方 Claude Code 入站流量不注入人设，也不注入 `web_search`。

## 布局

| 名字 | 行为 |
| --- | --- |
| `zero` | 不注入系统人设 |
| `official` | 官方形态，不带完整提示包 |
| `official_full` | 完整官方身份包 |
| 自定义 | 你自己的模板 |

`zero` 是「凭证层对齐、提示词层不改」的那个选项。换成 `official_full` 就会把身份写进提示，和零注入不是一回事。

## 覆写规则

规则在命中**最后一轮 user** 时，把覆写文本填进 overlay 的 `{{rules}}`。匹配为空或覆写为空的规则，保存时丢掉。`prompt-leak` 的覆写也是这一格，协议页没有第二个入口。

overlay 关掉时，下面的规则全部不生效。规则只有 overlay 这一条注入通道。要生效，先到 [设置 → 协议](../settings#protocol) 把 overlay 打开。

## 预览

改完先看预览里的出站 system，再保存。保存后的下一次请求才用新模板，已经在飞的请求不会改写。非官方客户端的 usage 会藏起网关加上的这块 system，官方 Claude Code 不藏。

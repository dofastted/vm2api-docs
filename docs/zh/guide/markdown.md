# Markdown 扩展

每个页面都是普通的 Markdown，并带有一些实用扩展。

## 提示块

::: info
读者需要了解的一般信息。
:::

::: tip
有用的建议。
:::

::: warning
需要注意的地方。
:::

::: danger
可能导致数据丢失或出错的操作。
:::

::: details 点击展开
读者可以展开查看的隐藏内容。
:::

## 代码高亮

```ts{3}
import { createClient } from 'acme'

const client = createClient({ apiKey: process.env.ACME_KEY })
const result = await client.run('hello')
```

## 代码组

::: code-group

```js [config.js]
export default { port: 8080 }
```

```yaml [config.yaml]
port: 8080
```

:::

## 徽章

文中徽章：<Badge type="tip" text="新" /> <Badge type="warning" text="测试版" /> <Badge type="danger" text="已弃用" />

## 表格

| 选项 | 类型 | 默认值 |
| --- | --- | --- |
| `port` | `number` | `8080` |
| `debug` | `boolean` | `false` |

# Markdown Features

Every page is plain Markdown with a few useful extensions. This page shows what's available.

## Callouts

::: info
Neutral information the reader should know.
:::

::: tip
A helpful suggestion.
:::

::: warning
Something to be careful about.
:::

::: danger
A step that can cause data loss or break things.
:::

::: details Click to expand
Hidden content that the reader can reveal.
:::

## Code with highlighting

```ts{3}
import { createClient } from 'acme'

const client = createClient({ apiKey: process.env.ACME_KEY })
const result = await client.run('hello')
```

## Code groups

::: code-group

```js [config.js]
export default { port: 8080 }
```

```yaml [config.yaml]
port: 8080
```

:::

## Badges

Status badges inline in text: <Badge type="tip" text="new" /> <Badge type="warning" text="beta" /> <Badge type="danger" text="deprecated" />

## Tables

| Option | Type | Default |
| --- | --- | --- |
| `port` | `number` | `8080` |
| `debug` | `boolean` | `false` |

## Emoji

:tada: :rocket: :100:

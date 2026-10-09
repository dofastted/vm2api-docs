# System prompts

`http://<host>:8787/console/#/system`

Edit persona templates and preview whether they will be injected on the way out. Official Claude Code inbound traffic is not injected with a persona, and it is not injected with `web_search`.

## Layouts

| Name | Behavior |
| --- | --- |
| `zero` | No injected system persona |
| `official` | Official shape, without the full prompt pack |
| `official_full` | The full official identity pack |
| custom | A template you stored |

`zero` is the mode that aligns identity at the credential layer and does not rewrite the prompt. `official_full` writes identity into the prompt. Those are not the same choice.

## Override rules

A rule fires on the **last user turn**. The override text fills `{{rules}}` in the overlay. A rule with an empty match or an empty override is dropped on save. The `prompt-leak` override is this same grid. The protocol tab has no second form for it.

While overlay is off, every rule below is inert. Rules have one injection path, the overlay. Turn overlay on from [Settings → Protocol](../settings#protocol) before you expect a rule to do anything.

## Preview

Read the outbound system in the preview, then save. The next request after the save uses the new template. A request already in flight is not rewritten. Usage shown to non-official clients hides the system block the gateway added. Official Claude Code usage is not hidden.

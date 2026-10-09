# Models

`http://<host>:8787/console/#/models`

This is the catalog `GET /v1/models` returns to clients. It is not a mirror of every model id that has ever existed on the upstream account. The names a client can select are the names on this page.

## What to check

- Unknown model from a client: look for the id in the catalog, then look at that slot's allow-list. A slot allow-list can be narrower than the global catalog.
- Editing the catalog does not replace the official client inside a slot, and it does not refresh OAuth.
- `claude-sonnet-5-5` has no native forced tool choice. If `tool_choice` must be honored, keep a model that still has it, such as `claude-sonnet-5`, and point the client at that id. The contract is in [Call the API](../api).

Persona layout (`zero`, `official`, `official_full`) is not a column on the model row. It is [Settings → Protocol](../settings#protocol) and [System prompts](./system).

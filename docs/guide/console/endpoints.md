# API endpoints

`http://<host>:8787/console/#/api`

The nav label is **API**. This page is named upstream endpoints, each with upstream keys and models under it. It is not [Call the API](../api). Callers still use this gateway's `:8787/v1/...`.

## Delete

Deleting an endpoint deletes every upstream key and every model under it. The confirm dialog says that. Before you confirm, check that no slot or route still points at it.

## Difference from the model catalog

[Models](./models) is what a client is allowed to see. This page is the upstream entry behind those catalog rows. Renaming a model in the catalog does not change a key stored here. Deleting an endpoint here removes the related models from the client catalog as well.

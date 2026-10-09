# Logs

`http://<host>:8787/console/#/logs`

One row per request. Filter, export, open the detail. This is where you ask why one call failed. Account windows are not on this page.

## Filters

| Group | What it filters |
| --- | --- |
| Time range | Date and time. Step to the previous or next period |
| Identity | Admins can filter by user, key, provider, and session. Others can filter by key and session |
| Request | Model, endpoint, protocol |
| Status | Status code, retry count, error class |

Active sessions sit at the top. Selecting one narrows the list to that session. The outbound session id and the client session id can differ. The tooltip shows both.

An error class can be shown alone, or hidden from the current view. Hiding does not delete the row.

## Export

Export follows the current filters, or ignores them and exports everything, or exports errors only. Errors-only then picks a class.

## Relation to settings

Whether a row is written at all is the record mode on [Settings → Logs](../settings#logs): off, normal, or debug. Leave debug off except while you are diagnosing. Delivery mode and the sticky header are in [Call the API](../api).

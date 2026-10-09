# Database

`http://<host>:8787/console/#/database`

Runtime counters for an administrator. The backup button is not here. Backups are [Settings → Backup](../settings#backup).

## Three blocks

- **Database runtime.** A snapshot. The card shows when it was sampled.
- **Prompt cache.** Hourly totals from `request_logs`. After log mode is turned off, new hours are empty.
- **Official usage cache.** In-process totals. If the gateway is not exposing that statistic, the card says so. The database snapshot is still there.

You cannot edit SQL here, and you cannot download the whole database. To take a copy you can restore, create a backup on the backup tab and download that. Changing `VM2API_DB_SECRET` makes the old database unreadable, and this page fails with it. The update script does not do that.

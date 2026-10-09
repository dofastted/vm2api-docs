# Users

`http://<host>:8787/console/#/users`

People who can sign in to the console. They are not [keys](./keys). A user has a session. A key does not.

## Roles

| Role | Label | What they can do |
| --- | --- | --- |
| `admin` | Administrator | Console administration, including users and nodes |
| `super` | Operator | Operations. Wider than a tenant, narrower than an administrator |
| `user` | Tenant | Their own keys and their own usage. Log filters do not list other users |

`VM2API_ADMIN_USER` from install is the first administrator.

## Passwords

A new password is 8 to 128 characters, typed twice. A mismatch cannot be submitted. After the change, that person's current session is invalid and they sign in again. The last column is the last sign-in. Never signed in shows as never.

Do not promote a tenant to administrator instead of issuing an `sk-vm-…` key. If they need to call a model, give them a key, not the console.

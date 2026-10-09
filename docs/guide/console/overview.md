# Overview

`http://<host>:8787/console/#/overview`

Three questions: is this machine healthy, can accounts still be scheduled, and was the last hour of service good. It does not draw multi-day trends ([Statistics](./statistics)), it does not list each request ([Logs](./logs)), and it does not open each account's 5-hour / 7-day cells ([Usage](./usage)).

## What you are looking at

- Cluster and local-host health. If the control plane itself is down, this page does not load. Use the log command on [Update](../upgrade).
- Whether accounts are schedulable. An unschedulable slot is not a candidate for a new request. The switch is on [Virtual machines](./vm).
- The last hour: success, failure, and which error classes showed up. A class links through to logs filtered to that class.

## When to open it

After install or update, look here before you send a test call. If health is green and every call is `502 incomplete_response`, there is no switch on this page for that. It is slot egress or DNS inside the slot. The steps are in the [FAQ](../../reference/faq).

Numbers here are aggregates. Quota, stickiness, and persona are changed in [Settings](../settings). Saving nothing on Overview changes none of them.

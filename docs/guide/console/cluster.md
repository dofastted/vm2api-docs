# Cluster

`http://<host>:8787/console/#/cluster`

This host is the console. Nodes below it are other VPS machines joined over SSH. They are not a second copy of the local slot list. Slots stay on [Virtual machines](./vm).

## This host

The card shows the address, link state, how many Docker containers are running, and how many slots. The Docker figure is running / total, including egress containers, not only `kin-*`.

## Join a VPS

With permission to manage nodes, the button is **Join VPS**. The host must be reachable by SSH. After it joins, remote Docker is managed through that one SSH session. A slot on the remote host still has one exit of its own. The rule is the same as on this machine.

## Remove a node

Remove disconnects SSH and deletes the credentials and the Docker bridge stored on this console. Containers on the remote machine keep running. They are not deleted by this action. Stop those slots on that machine first if you want them stopped, then remove the node.

## Shell will not connect

The cluster terminal and the ops terminal on a slot are browser WebSockets. If the page loads and the terminal drops immediately, nginx did not forward `Upgrade`. Fix the proxy. Do not recreate the node for that. The checklist is `docs/nginx-shell.md` in the product repository.

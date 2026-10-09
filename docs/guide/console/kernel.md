# Kernel

`http://<host>:8787/console/#/wrap`

The nav label is **Kernel**. This page installs, uploads, and syncs the kernel inside slots. It does not create a slot and it does not import an account.

## Where the sample lives

The default sample directory is `share/wrap-cli`. The control plane's main kernel is `KIN_KERNEL_BIN`, usually `bin/kin-kernel`. After a sync, the slot runs the copy that was synced. It does not run a newer file that is only on disk and has not been synced.

## What you can do

- Install the release kernel. Use this when a changelog row is marked `wrap-cli/sync`, or let the install script sync by default. Do not half-do both.
- Upload a binary. The cap is **32MB** per file. You are uploading a kernel, not a whole image.
- Pick a dataplane. Values a slot can show are `wrap`, `cc`, and `crag`. The protocol tab pins inference to rust cli-hop. There is no Go HTTP forwarder to turn on in the public build.
- Sync the sample to the slots you selected. Sync restarts the in-slot dataplane. It does not `docker rm` the slot, and it does not replay a request that was already sent.
- Promote a sample, or make the current slot the new sample. Confirm that slot's official setup succeeded first. Otherwise you copy a sample that is not logged in.

## After an update

If the control plane was upgraded and the file time on this page is still old, you passed `--no-sync-wrap` or the sync failed. New requests still use the old kernel. Finish the sync, then check on the virtual-machine page that the slot is still schedulable.

Restarting the control plane does not replace a process that is already running inside a slot.

# Gateway command handler — initial local implementation

This module is the command-processing foundation for E3. It has no MQTT client, Linux deployment,
pairing, device driver or real AWS connection. An adapter must inject the physical executor and use
the authenticated gateway configuration. Only persistent LIGHT/AIR_CONDITIONER/WATER_PUMP commands
are accepted; gate/lock/transient actions are not implemented.

Instantiate GatewayCommandHandler with gatewayId, an absolute stateDirectory on persistent storage,
resources indexed by opaque device ID, and an async execute function. Each resource declares
deviceType, profileVersion, enabled, and feedbackEnabled. Feedback must be enabled only after the
actual device report path has been tested for that hardware/profile. Backend commandFeedback is NONE
by default; configure DEVICE_REPORT in the profile only when that same report path is available.

The execute function receives the validated payload and commandId/expiresAt. It must enforce local
permissions, expiry and hardware interlocks immediately before its operation. Returning a successful
API response is insufficient evidence. A confirming report contains sourceEventId, observedAt (UTC),
and reported values observed from the actual device. The cloud verifies the matching state/window;
hardware truth still depends on this trusted adapter and cannot be established from a JSON contract alone.

The handler creates an exclusive command directory, writes/fsyncs the intent and ACK before execute,
and writes/fsyncs its result. Linux also syncs directory entries. A new handler instance reuses the
stored result for the same command; changing its content conflicts. An intent without a readable
result is REQUIRES_RECONCILIATION and is not automatically executed again, including after a restart.
Without valid feedback the result remains ACKNOWLEDGED/unconfirmed. Unknown expired commands do not
execute; known duplicates can return their already stored result after expiry.

Returned events use the shared envelope with eventType=command.ack, sequence 0 (receipt) and 1
(execution). Message IDs are stable hashes. GatewayEventUploader reads these persisted events
and retries the identical messages, without invoking execute again.
No event is published by this module itself.

## Durable event upload (local transport contract)

Instantiate `GatewayEventUploader` from `event-uploader.js` with gatewayId, the same absolute
stateDirectory, and an injected `transport.publishEvent(event)`. Call `uploadPending({limit:100})`
from the future agent loop; there is no automatic scheduler or network client. The maximum batch
is 500 publication attempts. Configure one uploader per volume; overlapping calls on the same
instance return BUSY. Duplicate deliveries across processes still require backend idempotency.

Command directories are the initial spool: the uploader verifies intent hashes and gateway/event
identity, sends ACK before execution feedback, and recovers the ACK even without a result after
a crash. Accepted events retain per-stage receipt files; failed or uncertain deliveries retain
backoff across restart (2 seconds initially, capped at 60). Receipt writes use temporary files,
fsync and atomic rename. A crash after cloud commit but before local receipt retries the same ID.
No command/event/receipt is deleted and no actuator is invoked by upload.

The transport returns `{accepted:true,messageId:event.messageId}` only after durable backend
ingestion (including an idempotent duplicate). MQTT PUBACK alone is insufficient. A real adapter
must authenticate that application receipt; the current implementation injects a simulated
transport and does not provide MQTT subscriptions, receipt topics or certificate configuration.
Corrupt/foreign spool entries are retained, counted as invalid, and isolated from other commands.
Inputs larger than 16 KiB or symbolic-link files are rejected. Use a trusted, private storage volume.
Old events rejected by the backend remain pending for reconciliation; their timestamps are never
rewritten to bypass freshness. Reconciliation UI and safe retention remain pending.
The directory scan streams entries but may inspect historical commands; the attempt limit is
not a total disk-size or scan-time bound.

## Storage admission limits

The handler now checks `GatewaySpoolCapacity` before claiming each new command. Configure its
`storage` option with maxBytes (default 64 MiB), maxCommands (default 10,000), and minFreeBytes
(default 16 MiB). These are local development defaults, not a selected production retention policy.
Each command reserves at least 64 KiB for intent, ACK, result and future delivery receipts;
larger existing directories count their actual logical file sizes. Consequently the default byte
budget admits at most 1,024 small commands even though the separate count limit is 10,000.
Legacy command directories count toward both limits without needing a backfill.

Admission checks filesystem free space and uses an exclusive `command-admission.lock` across
instances/processes while scanning and reserving a directory. Capacity exhaustion returns
IOT_EDGE_STORAGE_FULL before ACK or physical action. Concurrent admission returns
IOT_EDGE_STORAGE_BUSY. Known commands still replay their stored result at capacity; the uploader
can continue delivering their events. Directories or symbolic links in unexpected places require
reconciliation. No historical, pending or uncertain command is automatically deleted.

These are conservative application admission limits, not an OS filesystem quota. Other processes,
filesystem allocation overhead and concurrent upload writes can change free space. Deploy on a
dedicated private volume with monitoring and filesystem quota/headroom before a physical pilot.
The full scan grows with retained command count. The reservation is logical accounting rather than
physical preallocation; disk failures during execution can still leave an uncertain result.

If the process crashes while holding the admission lock, new commands remain blocked. Recovery
requires stopping all agent instances sharing the volume, inspecting the lock and command intent/
result records, and removing only the stale admission lock after exclusive ownership is established.
Never remove a lock based only on elapsed time or PID absence while agents can still run. A command
directory missing intent/result stays reserved and cannot trigger an automatic second action.
Retention/compaction needs an approved deduplication window and archival policy before implementation;
until then, a full spool requires operator reconciliation rather than automatic history deletion.

## Durable gateway health producer

The backend now provides internal `IoTHeartbeatService.ingestHeartbeat` behind the ingestion flag.
The trusted transport must supply authenticatedThingName independently of payload. A heartbeat
uses the shared envelope with resourceId=gatewayId, profileVersion=1 and eventType=gateway.heartbeat.
Its payload contains agentVersion, configurationVersion, uptimeSeconds, spoolCommandCount,
spoolAccountedBytes, spoolCapacityBytes and storageBlocked. Reports never alter authoritative
configuration and never mark child devices online. Gateway connectivity ages out after five minutes.

`GatewayHeartbeatProducer` in `heartbeat-producer.js` persists sequence and the latest pending
heartbeat together in `heartbeat-state.json`, with fsync and atomic replacement before publication.
Stable ID, payload, sequence and timestamp survive restart and uncertain delivery. The next report
is sampled after an application receipt completes the current one and the sampling interval is
due (60 seconds by default, configurable from 30 to 120 seconds).

Inject `sample()` returning configurationVersion, spoolCommandCount, spoolAccountedBytes,
spoolCapacityBytes and storageBlocked. Report the configuration actually applied by the agent.
The producer adds eventType, agentVersion and process uptime; it rejects extra/invented fields.
`GatewaySpoolCapacity.health(appliedVersion)` reads command spool and disk headroom without
claiming commands or creating spool directories. Recording counts are excluded from this helper.
No report marks cameras or child devices online.

Inject `transport.publishHeartbeat(event)` with authenticated application receipts. It returns
`{accepted:true,messageId}` only after durable ingestion or an accepted duplicate. PUBACK, wrong
IDs and uncertain errors keep the original report pending with persistent backoff (2–60 seconds).
A stale pending report is retired only after a matching
`{rejected:true,messageId,code:"IOT_EVENT_STALE"}` rejection and local age >5 minutes; the next
sample has a new sequence/ID/time. The old timestamp is never rewritten. Health state retains
the latest terminal receipt (ID/hash/status), with bounded local state.

Call `tick()` from an agent loop, or explicitly `start({onError})` for a five-second retry sweep
and `stop()` to cancel future sweeps. Constructor does not publish or start a timer. `stop()`
does not cancel an in-flight publication; transport must bound its timeout and the host must
allow durable receipt completion during shutdown. The unref'd timer does not keep a standalone
process alive. No production agent automatically instantiates this producer; no MQTT/HTTP
transport, certificates or resource configuration were added here.

An exclusive `heartbeat.lock` serializes instances/processes. Corrupt, oversized, symlink or
foreign gateway state fails closed and is retained; a residual lock after crash needs operator
recovery with every agent on the volume stopped. Never remove state to reset a sequence: preserve
this volume across deployments. Lost state needs explicit recovery against cloud state. Clock
rollback delays new sampling; sequence exhaustion requires reconciliation. Windows local tests
verify logic, not Linux power-loss durability.

Local tests:

```powershell
node --test edge/gateway-agent/tests/*.test.js
```

Pending before E3 acceptance: mTLS/topic policies and application receipts, wiring the producer into
the deployed agent, driver integration, sequence
management for device states, config/revocation, OS storage quota/monitoring and receipt retention, Linux power-loss
tests and hardware feedback. Windows tests exercise the logic; they do not certify Linux fsync or
filesystem behavior under power loss. Keep the storage volume persistent across container replacement.

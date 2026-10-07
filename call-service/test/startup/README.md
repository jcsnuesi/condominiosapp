# Container startup regression (2026-10-06)

The isolated test uses the production `builder.yml` with a disposable MongoDB
replica set, a backend fixture implementing health and authenticated recovery,
synthetic secrets and a one-day self-signed TURN certificate. No host ports are
published. Existing local containers and databases are untouched.

## Reproduced failures and fixes

- `tmpfs: [/tmp:size=16m, mode=1777]` creates a second mount named `mode=1777`.
  Docker rejects it with `invalid mount path`. Both services now use one quoted
  tmpfs specification.
- `call-service` and `coturn` were excluded from normal Compose startup by the
  `calls` profile. They now belong to the default deployment.
- The upstream coturn binary failed with `Operation not permitted` under
  `cap_drop: ALL`. The derived image copies it without extended attributes,
  preserving the unprivileged user and all existing container restrictions.
- Coturn previously exited silently when certificates were absent. The script
  now reports the missing file and `TURN_CERTS_DIR`. It is included in the image
  instead of depending on a source-code bind mount in production.
- A fresh schedule database rejected the worker with
  `Run schedule:migrate:apply before starting the worker`. Compose now runs the
  existing idempotent migration as a one-shot service before starting the worker.
- The alternative `schedule-worker/Dockerfile` omitted authorization services
  and models. It now uses current backend sources with repository-root context.
- Call-service diagnostics now distinguish missing configuration, backend token
  mismatch and backend recovery failure without printing secret values.

## Repeat locally

Run from the repository root. Requires Docker Compose supporting `!reset` and
`!override`, Python and the Python `cryptography` package for the test certificate.

```powershell
python call-service/test/startup/create-cert.py
docker compose --env-file call-service/test/startup/test.env -f builder.yml -f call-service/test/startup/override.yml -p container-startup-check up -d --build --wait --wait-timeout 120 schedule-worker call-service coturn
docker compose --env-file call-service/test/startup/test.env -f builder.yml -f call-service/test/startup/override.yml -p container-startup-check run --rm --no-deps -v "${PWD}/call-service/test/startup/check.cjs:/check.cjs:ro" call-service node /check.cjs
docker compose --env-file call-service/test/startup/test.env -f builder.yml -f call-service/test/startup/override.yml -p container-startup-check ps -a
node --test call-service/test/*.test.js backend/modules/schedule/tests/worker-image.test.js backend/modules/schedule/tests/rules.test.js
docker compose --env-file call-service/test/startup/test.env -f builder.yml -f call-service/test/startup/override.yml -p container-startup-check down --volumes
```

Validated: all three target containers healthy, migration exits 0 and can run
again, call-service `/health` returns 200, coturn answers UDP STUN and accepts
TLS on 5349. All 31 unit and integration tests pass and cover the real backend call routes
and Socket.IO flow. The container backend fixture does not validate production
backend connectivity. The TURN checks do not validate public firewall rules,
certificate trust, relay allocation or end-to-end audio over the Internet.

## Production settings and deployment

Set these in the runtime environment used by Coolify/Compose:

- `MONGODB_URI`: valid connection URI with migration permissions for collection
  creation, `collMod` and indexes; `OCR_SERVICE_TOKEN` is also required by Compose.
- `CALL_TOKEN_SECRET`, `CALL_INTERNAL_TOKEN`, `TURN_AUTH_SECRET`: three distinct
  random secrets, each at least 32 characters. The backend and call-service must
  receive the same `CALL_INTERNAL_TOKEN`.
- `CALL_FRONTEND_ORIGINS`: exact HTTPS frontend origins, comma separated.
- `TURN_REALM`, `TURN_EXTERNAL_IP`, `TURN_URLS`: public TURN domain, public server
  address and the UDP/TCP/TLS URLs that clients will use.
- `TURN_CERTS_DIR`: absolute host directory, default `/srv/coturn/certs`, containing
  `fullchain.pem` and `privkey.pem`, readable by UID 65534. The directory must exist
  on the deployment server. The test certificate and test secrets are fixtures.

```sh
docker compose -f builder.yml config --quiet
docker compose -f builder.yml up -d --build schedule-worker call-service coturn
docker compose -f builder.yml ps -a
docker compose -f builder.yml logs --tail 50 schedule-migrate schedule-worker call-service coturn
```

The repository changes have been verified locally; production has not been
redeployed or inspected. Build `schedule-worker/Dockerfile` from the repository
root if Coolify uses that alternative file rather than `builder.yml`.

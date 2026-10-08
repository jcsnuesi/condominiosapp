#!/usr/bin/env bash
set -euo pipefail
umask 077
: "${SAAS_BACKUP_MONGODB_URI:?Configure a MongoDB URI with backup privileges for the full replica set}"
: "${SAAS_BACKUP_PASSWORD:?Configure a strong backup encryption password}"
mkdir -p /backups
temporary=$(mktemp -d /tmp/comunard-backup.XXXXXX)
cleanup() {
  if [[ -f "$temporary/restore/mongod.lock" ]]; then mongod --dbpath "$temporary/restore" --shutdown >/dev/null 2>&1 || true; fi
  case "$temporary" in /tmp/comunard-backup.*) rm -rf -- "$temporary" ;; esac
}
trap cleanup EXIT
# JSON is valid YAML; credentials stay in a private file and never in logs or CLI arguments.
export CONFIG_FILE="$temporary/config.json"
python3 -c 'import json,os; json.dump({"uri":os.environ["SAAS_BACKUP_MONGODB_URI"]},open(os.environ["CONFIG_FILE"],"w"))'
mongodump --config "$CONFIG_FILE" --oplog --archive="$temporary/database.archive.gz" --gzip >/dev/null 2>&1
tar -czf "$temporary/uploads.tar.gz" -C /uploads .
stamp=$(date -u +%Y%m%dT%H%M%SZ)
tar -czf "$temporary/backup.tar.gz" -C "$temporary" database.archive.gz uploads.tar.gz
python3 /usr/local/bin/comunard-backup-crypto encrypt "$temporary/backup.tar.gz" "/backups/$stamp.tar.gz.enc"
sha256sum "/backups/$stamp.tar.gz.enc" > "/backups/$stamp.sha256"
# Verify the encrypted artifact by decrypting and restoring to an isolated, loopback-only server.
mkdir -p "$temporary/verified" "$temporary/restore"
python3 /usr/local/bin/comunard-backup-crypto decrypt "/backups/$stamp.tar.gz.enc" "$temporary/verified.tar.gz"
tar -xzf "$temporary/verified.tar.gz" -C "$temporary/verified"
tar -tzf "$temporary/verified/uploads.tar.gz" >/dev/null
mongod --dbpath "$temporary/restore" --bind_ip 127.0.0.1 --port 27019 --fork --logpath "$temporary/restore.log" >/dev/null
mongorestore --uri mongodb://127.0.0.1:27019 --archive="$temporary/verified/database.archive.gz" --gzip --oplogReplay >/dev/null 2>&1
mongosh --quiet mongodb://127.0.0.1:27019 --eval 'for (const entry of db.adminCommand({listDatabases:1}).databases) { const database=db.getSiblingDB(entry.name); for (const coll of database.getCollectionNames()) { if (coll.startsWith("system.")) continue; const result=database.runCommand({validate:coll}); if (!result.ok || !result.valid) quit(1); }}' >/dev/null
offsite=false
if [[ -n "${SAAS_BACKUP_S3_URI:-}" ]]; then
  [[ "$SAAS_BACKUP_S3_URI" =~ ^s3://[a-z0-9][a-z0-9.-]+(/[A-Za-z0-9_./-]*)?$ ]] || exit 1
  remote="${SAAS_BACKUP_S3_URI%/}/$stamp.tar.gz.enc"
  aws s3 cp "/backups/$stamp.tar.gz.enc" "$remote" --only-show-errors --checksum-algorithm SHA256
  aws s3 cp "$remote" "$temporary/offsite-proof.enc" --only-show-errors
  cmp -s "/backups/$stamp.tar.gz.enc" "$temporary/offsite-proof.enc"
  offsite=true
fi
printf '{"backupAt":"%s","restoredAt":"%s","artifact":"%s","verified":true,"offsiteVerified":%s}\n' "$(date -u +%FT%TZ)" "$(date -u +%FT%TZ)" "$stamp.tar.gz.enc" "$offsite" > /backups/status.json.tmp
mv /backups/status.json.tmp /backups/status.json
echo 'Comunard backup and isolated restore verified.'

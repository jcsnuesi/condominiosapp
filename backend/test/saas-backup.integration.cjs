"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fixture = `codex-saas-backup-${process.pid}`;
const docker = args => execFileSync("docker", args, { encoding: "utf8", windowsHide: true, timeout: 120000, stdio: ["ignore", "pipe", "pipe"] }).trim();
test("encrypted backup restores a disposable replica set and rejects tampering", async () => {
  let started = false;
  try {
    docker(["run", "--rm", "-d", "--name", fixture, "-e", "SAAS_BACKUP_MONGODB_URI=mongodb://127.0.0.1:27017/?replicaSet=backup-test", "-e", "SAAS_BACKUP_PASSWORD=isolated-test-password-not-a-real-secret", "comunard-saas-backup-validation:local", "mongod", "--replSet", "backup-test", "--bind_ip", "127.0.0.1"]); started = true;
    for (let attempt = 0; ; attempt++) {
      try { docker(["exec", fixture, "mongosh", "--quiet", "--eval", 'rs.initiate({_id:"backup-test",members:[{_id:0,host:"127.0.0.1:27017"}]})']); break; }
      catch (e) { if (attempt > 30) throw e; await new Promise(resolve => setTimeout(resolve, 500)); }
    }
    docker(["exec", fixture, "mongosh", "--quiet", "--eval", 'while(!db.hello().isWritablePrimary){sleep(100)};db.getSiblingDB("isolated_backup").proof.insertOne({marker:"restoration-proof"})']);
    docker(["exec", fixture, "bash", "-c", 'mkdir -p /uploads; printf fixture-file > /uploads/proof.txt; /usr/local/bin/comunard-backup']);
    const status = JSON.parse(docker(["exec", fixture, "cat", "/backups/status.json"])); assert.equal(status.verified, true);
    assert.equal(status.offsiteVerified, false);
    const artifact = `/backups/${status.artifact}`;
    docker(["exec", fixture, "python3", "/usr/local/bin/comunard-backup-crypto", "decrypt", artifact, "/tmp/verified-proof.tar.gz"]);
    docker(["exec", fixture, "python3", "-c", 'import sys; p=sys.argv[1];b=bytearray(open(p,"rb").read());b[-20]^=1;open("/tmp/tampered.enc","wb").write(b)', artifact]);
    assert.throws(() => docker(["exec", fixture, "python3", "/usr/local/bin/comunard-backup-crypto", "decrypt", "/tmp/tampered.enc", "/tmp/tampered-output.tar.gz"]));
    assert.equal(docker(["exec", fixture, "bash", "-c", 'test ! -f /tmp/tampered-output.tar.gz && echo authenticated']), "authenticated");
    // Exercise the external-copy branch with a local storage double. This does
    // not claim that a production S3 bucket or its permissions were validated.
    docker(["exec", "-e", "SAAS_BACKUP_S3_URI=s3://isolated-backups/proof", fixture, "bash", "-c", 'aws(){ if [[ "$3" == s3://* ]]; then cp /tmp/offsite-fixture.enc "$4"; else cp "$3" /tmp/offsite-fixture.enc; fi; }; export -f aws; /usr/local/bin/comunard-backup']);
    assert.equal(JSON.parse(docker(["exec", fixture, "cat", "/backups/status.json"])).offsiteVerified, true);
  } finally { if (started) docker(["rm", "-f", fixture]); }
});

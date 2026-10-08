"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { CameraS3Storage } = require("../infrastructure/s3Storage");
const { S3Client } = require("@aws-sdk/client-s3");
const key = `camera/${"a".repeat(24)}/${"b".repeat(24)}/${"c".repeat(24)}`;
test("real SDK signs required PUT headers locally without network access", async () => {
  const client = new S3Client({ region: "us-east-1", credentials: { accessKeyId: "LOCAL_TEST_ONLY", secretAccessKey: "local-test-only" } });
  client.send = async () => { throw new Error("NETWORK_FORBIDDEN"); };
  try {
    const storage = new CameraS3Storage({ bucket: "comunard-private-test", expectedOwner: "337647889342", client });
    const permission = await storage.presignWrite({ objectKey: key, status: "PENDING", kind: "CLIP", checksum: "a".repeat(64), sizeBytes: 100 });
    const url = new URL(permission.url);
    assert.equal(url.hostname, "comunard-private-test.s3.us-east-1.amazonaws.com");
    assert.equal(url.searchParams.get("X-Amz-Expires"), "60");
    const headers = url.searchParams.get("X-Amz-SignedHeaders").split(";");
    for (const header of ["content-length", "content-type", "if-none-match", "x-amz-checksum-sha256", "x-amz-server-side-encryption"]) assert.ok(headers.includes(header));
    assert.equal(permission.headers["if-none-match"], "*");
  } finally { client.destroy(); }
});
test("S3 permissions are short, exact-object, immutable writes with validated checksums", async () => {
  const commands = [];
  const storage = new CameraS3Storage({ bucket: "comunard-private-test", expectedOwner: "337647889342", client: {},
    presign: async (_client, command, options) => { commands.push({ input: command.input, options }); return "https://private.example.invalid/signed"; } });
  await storage.presignWrite({ objectKey: key, status: "PENDING", kind: "CLIP", checksum: "a".repeat(64), sizeBytes: 100 });
  assert.equal(commands[0].input.Key, key); assert.equal(commands[0].input.IfNoneMatch, "*");
  assert.equal(commands[0].input.ContentLength, 100); assert.equal(commands[0].input.ServerSideEncryption, "AES256");
  assert.equal(commands[0].options.expiresIn, 60);
  assert.equal(commands[0].input.ChecksumSHA256, Buffer.from("a".repeat(64), "hex").toString("base64"));
  await storage.presignRead({ objectKey: key, ttlSeconds: 30 });
  assert.equal(commands[1].input.ResponseCacheControl, "private, no-store");
  await assert.rejects(storage.presignRead({ objectKey: "other-context/key", ttlSeconds: 30 }), { code: "CAMERA_OBJECT_INVALID" });
});
test("storage inspection trusts S3 checksum rather than ETag or caller metadata", async () => {
  let response = { ContentLength: 100, ETag: "not-proof", Metadata: { sha256: "a".repeat(64) } }, request;
  const storage = new CameraS3Storage({ bucket: "comunard-private-test", expectedOwner: "337647889342",
    client: { send: async (command) => { request = command.input; return response; } } });
  assert.equal(await storage.inspectObject(key), null);
  response = { ...response, ChecksumSHA256: Buffer.from("a".repeat(64), "hex").toString("base64") };
  assert.deepEqual(await storage.inspectObject(key), { sizeBytes: 100, sha256: "a".repeat(64) });
  assert.equal(request.ChecksumMode, "ENABLED"); assert.equal(request.ExpectedBucketOwner, "337647889342");
});

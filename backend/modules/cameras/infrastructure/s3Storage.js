"use strict";
const { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { apiError } = require("../../../service/iotService");

class CameraS3Storage {
  constructor({ bucket, expectedOwner, region = "us-east-1", client, presign = getSignedUrl } = {}) {
    if (typeof bucket !== "string" || !/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(bucket) ||
      !/^[0-9]{12}$/.test(expectedOwner || "") || region !== "us-east-1")
      throw apiError("CAMERA_STORAGE_CONFIG_INVALID", "Camera bucket/owner/region required", 503);
    Object.assign(this, { bucket, expectedOwner, presign });
    // Default credential chain uses the deployment role; no credentials in configuration/DTOs.
    this.client = client || new S3Client({ region, maxAttempts: 2 });
  }
  objectInput(key) {
    if (typeof key !== "string" || !/^camera\/[a-f0-9]{24}\/[a-f0-9]{24}\/[a-f0-9]{24}$/.test(key))
      throw apiError("CAMERA_OBJECT_INVALID", "Invalid persisted recording key", 422);
    return { Bucket: this.bucket, Key: key, ExpectedBucketOwner: this.expectedOwner };
  }
  async presignRead({ objectKey, ttlSeconds }) {
    if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1 || ttlSeconds > 60) throw apiError("CAMERA_OBJECT_INVALID", "Invalid playback lifetime", 422);
    return this.presign(this.client, new GetObjectCommand({ ...this.objectInput(objectKey),
      ResponseCacheControl: "private, no-store", ResponseContentDisposition: "inline" }), { expiresIn: ttlSeconds });
  }
  async presignWrite(recording) {
    if (recording.status !== "PENDING" || !/^[a-f0-9]{64}$/.test(recording.checksum || ""))
      throw apiError("CAMERA_OBJECT_INVALID", "Recording is not pending", 409);
    const checksum = Buffer.from(recording.checksum, "hex").toString("base64");
    const contentType = recording.kind === "CLIP" ? "video/mp4" : "image/jpeg";
    const url = await this.presign(this.client, new PutObjectCommand({ ...this.objectInput(recording.objectKey),
      ContentLength: recording.sizeBytes, ContentType: contentType, ChecksumSHA256: checksum,
      ServerSideEncryption: "AES256", IfNoneMatch: "*" }), { expiresIn: 60,
        unhoistableHeaders: new Set(["x-amz-checksum-sha256", "x-amz-server-side-encryption"]),
        signableHeaders: new Set(["content-type", "content-length", "if-none-match"]) });
    return { url, headers: { "content-type": contentType, "x-amz-checksum-sha256": checksum,
      "x-amz-server-side-encryption": "AES256", "if-none-match": "*" }, ttlSeconds: 60 };
  }
  async inspectObject(key) {
    try {
      const result = await this.client.send(new HeadObjectCommand({ ...this.objectInput(key), ChecksumMode: "ENABLED" }));
      // Single PUT only: never substitute metadata or ETag for the S3-validated full checksum.
      if (!result.ChecksumSHA256 || !/^[A-Za-z0-9+/]{43}=$/.test(result.ChecksumSHA256)) return null;
      return { sizeBytes: result.ContentLength, sha256: Buffer.from(result.ChecksumSHA256, "base64").toString("hex") };
    } catch (error) {
      if ([403, 404].includes(error.$metadata?.httpStatusCode)) return null;
      throw apiError("CAMERA_STORAGE_INSPECTION_FAILED", "Recording storage inspection failed", 502);
    }
  }
}
module.exports = { CameraS3Storage };

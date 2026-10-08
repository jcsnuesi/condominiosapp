"use strict";
const { CameraInventoryService } = require("./application/inventoryService");
const { CameraLiveService } = require("./application/liveService");
const { MediaControl } = require("./infrastructure/mediaControl");
let singleton;
function cameraRuntime() {
  if (singleton) return singleton;
  const storage = process.env.CAMERAS_ENABLED === "true" && process.env.CAMERA_RECORDINGS_BUCKET
    ? new (require("./infrastructure/s3Storage").CameraS3Storage)({ bucket: process.env.CAMERA_RECORDINGS_BUCKET,
      expectedOwner: process.env.CAMERA_RECORDINGS_BUCKET_OWNER, region: process.env.AWS_REGION || "us-east-1" }) : undefined;
  const inventory = new CameraInventoryService({ storage });
  const configured = process.env.CAMERAS_ENABLED === "true" && process.env.CAMERA_MEDIA_GATEWAY_ID &&
    process.env.CAMERA_WHEP_ORIGIN && process.env.CAMERA_MEDIA_CONTROL_ORIGIN && process.env.CAMERA_MEDIA_CONTROL_PASSWORD &&
    (process.env.CAMERA_MEDIA_AUTH_SERVICE_KEY || "").length >= 32 && process.env.DISABLE_SCHEDULED_JOBS !== "true";
  const media = configured ? new MediaControl({ gatewayId: process.env.CAMERA_MEDIA_GATEWAY_ID,
    whepOrigin: process.env.CAMERA_WHEP_ORIGIN, controlOrigin: process.env.CAMERA_MEDIA_CONTROL_ORIGIN,
    controlUser: process.env.CAMERA_MEDIA_CONTROL_USER, controlPassword: process.env.CAMERA_MEDIA_CONTROL_PASSWORD }) : undefined;
  inventory.media = media;
  singleton = { inventory, live: new CameraLiveService({ inventory, media }),
    events: new (require("./application/eventService").CameraEventService)({ storage, retentionDays: 7 }) };
  return singleton;
}
module.exports = { cameraRuntime };

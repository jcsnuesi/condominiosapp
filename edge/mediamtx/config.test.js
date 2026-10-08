"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { mediaConfiguration } = require("./render-config");
const input = () => ({ sources: [{ streamId: "camera-test", rtspSource: "rtsp://192.168.1.20:554/Streaming/Channels/101" }],
  appOrigins: ["https://app.example.invalid"], additionalHosts: ["video.example.invalid"],
  iceServers: [{ url: "turn:turn.example.invalid:3478", username: "placeholder", password: "placeholder" }] });
test("camera pilot requires authenticated media and disables continuous recordings", () => {
  const config = mediaConfiguration(input());
  assert.equal(config.paths["camera-test"].record, false);
  assert.equal(config.authMethod, "http"); assert.deepEqual(config.authHTTPExclude, []);
  assert.equal(config.webrtcAddress, "127.0.0.1:8889"); assert.equal(config.apiAddress, "127.0.0.1:9997");
  assert.equal(config.rtsp, false); assert.equal(config.hls, false);
  assert.throws(() => mediaConfiguration({ ...input(), iceServers: [] }));
  assert.throws(() => mediaConfiguration({ ...input(), appOrigins: ["http://app.example.invalid"] }));
  assert.throws(() => mediaConfiguration({ ...input(), sources: [...input().sources, ...input().sources] }));
});

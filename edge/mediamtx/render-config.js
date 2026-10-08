"use strict";
const fs = require("node:fs/promises");
const { writeDurable } = require("../gateway-agent/durable-storage");
function mediaConfiguration(input) {
  if (!input || !Array.isArray(input.sources) || input.sources.length > 16 ||
    !Array.isArray(input.appOrigins) || !input.appOrigins.length || input.appOrigins.some((value) => new URL(value).protocol !== "https:") ||
    !Array.isArray(input.iceServers) || !input.iceServers.length || !Array.isArray(input.additionalHosts) || !input.additionalHosts.length)
    throw new Error("MEDIA_CONFIG_INVALID");
  const paths = {};
  for (const source of input.sources) {
    if (!/^camera-[A-Za-z0-9_-]{1,100}$/.test(source.streamId || "") || Object.hasOwn(paths, source.streamId)) throw new Error("MEDIA_CONFIG_INVALID");
    const rtsp = new URL(source.rtspSource);
    if (!["rtsp:", "rtsps:"].includes(rtsp.protocol) || ["localhost", "127.0.0.1", "169.254.169.254"].includes(rtsp.hostname)) throw new Error("MEDIA_SOURCE_INVALID");
    paths[source.streamId] = { source: source.rtspSource, rtspTransport: "tcp", sourceOnDemand: false, record: false };
  }
  return { logLevel: "warn", logDestinations: ["stdout"], authMethod: "http",
    authHTTPAddress: "http://127.0.0.1:8090/auth", authHTTPExclude: [],
    api: true, apiAddress: "127.0.0.1:9997", apiAllowOrigins: [], metrics: false, pprof: false,
    rtsp: false, rtmp: false, hls: false, srt: false, webrtc: true, webrtcAddress: "127.0.0.1:8889",
    webrtcAllowOrigins: input.appOrigins, webrtcLocalUDPAddress: ":8189", webrtcAdditionalHosts: input.additionalHosts,
    webrtcICEServers2: input.iceServers, paths };
}
if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2);
    if (args.length !== 2) throw new Error("MEDIA_CONFIG_PATHS_REQUIRED");
    const info = await fs.lstat(args[0]);
    if (!info.isFile() || info.isSymbolicLink() || info.size > 65536) throw new Error("MEDIA_CONFIG_INVALID");
    await writeDurable(args[1], mediaConfiguration(JSON.parse(await fs.readFile(args[0], "utf8"))));
  })().catch(() => { process.stderr.write("MEDIA_CONFIG_RENDER_FAILED\n"); process.exitCode = 1; });
}
module.exports = { mediaConfiguration };

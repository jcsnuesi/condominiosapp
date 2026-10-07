"use strict";
const { createCallService } = require("./server");
async function start() {
  let service;
  try {
    service = createCallService();
  } catch (error) {
    // Configuration errors contain variable names only, never their values.
    console.error(`Call service configuration: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  process.on("SIGTERM", () => service.close().then(() => process.exit(0)));
  process.on("SIGINT", () => service.close().then(() => process.exit(0)));
  try {
    await service.listen(Number(process.env.PORT || 4000));
    console.log("Call service ready on port " + Number(process.env.PORT || 4000));
  } catch (error) {
    console.error(error.code === "unauthorized"
      ? "Call service backend authentication failed; check CALL_INTERNAL_TOKEN matches the backend"
      : "Call service could not initialize backend history; check CALL_BACKEND_URL and backend availability");
    process.exit(1);
  }
}
start();

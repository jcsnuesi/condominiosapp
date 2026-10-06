"use strict";
const { createCallService } = require("./server");
const service = createCallService();
process.on("SIGTERM", () => service.close().then(() => process.exit(0)));
process.on("SIGINT", () => service.close().then(() => process.exit(0)));
service.listen(Number(process.env.PORT || 4000)).catch(() => {
  console.error("Call service could not initialize backend history");
  process.exit(1);
});

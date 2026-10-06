"use strict";

// A delivery failure must not undo a successfully created or activated account.
module.exports = async function notifyWelcome(account, emailService = require("./generateVerification")) {
  try {
    await emailService.sendWelcome(account);
    return true;
  } catch (error) {
    console.error("Welcome email failed:", error?.code || "SMTP_ERROR");
    return false;
  }
};

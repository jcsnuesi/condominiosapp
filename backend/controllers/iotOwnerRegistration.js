"use strict";

const {
  IoTOwnerRegistrationService,
} = require("../service/iotOwnerRegistrationService");

function sendError(res, error) {
  return res.status(error.statusCode || 500).send({
    status: "error",
    code: error.code || "IOT_OWNER_REGISTRATION_FAILED",
    message:
      error.statusCode && error.statusCode < 500
        ? error.message
        : "Account registration is unavailable",
  });
}

function createIoTOwnerRegistrationController(
  service = new IoTOwnerRegistrationService()
) {
  return {
    resend: async (req, res) => {
      try {
        await service.resend(req.body?.email);
        return res.status(202).send({ status: "success", message: "Si hay una cuenta pendiente, recibirás un nuevo enlace de verificación." });
      } catch (error) { return sendError(res, error); }
    },
    register: async (req, res) => {
      try {
        await service.register(req.body || {});
        return res.status(202).send({
          status: "success",
          message:
            "If the address can be registered, a verification email will be sent.",
        });
      } catch (error) {
        return sendError(res, error);
      }
    },
    verify: async (req, res) => {
      try {
        await service.verify(req.params.token);
        return res.status(200).send({
          status: "success",
          message: "Owner account verified. You can now sign in.",
        });
      } catch (error) {
        return sendError(res, error);
      }
    },
  };
}

module.exports = createIoTOwnerRegistrationController();
module.exports.createIoTOwnerRegistrationController =
  createIoTOwnerRegistrationController;

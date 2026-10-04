"use strict";
const { AdminRegistrationService } = require("../service/adminRegistrationService");

function createAdminRegistrationController(service = new AdminRegistrationService()) {
  const fail = (res, error) => res.status(error.code === 11000 ? 409 : error.statusCode || 500).send({
    status: "error", code: error.code || "ADMIN_REGISTRATION_FAILED",
    message: error.code === 11000 ? "Ya tienes una cuenta. Inicia sesión o recupera tu contraseña." : error.statusCode && error.statusCode < 500 ? error.message : "El registro no está disponible. Intenta nuevamente.",
  });
  return {
    resend: async (req, res) => {
      try {
        await service.resend(req.body?.email);
        return res.status(202).send({ status: "success", message: "Si hay una cuenta pendiente, recibirás un nuevo enlace de verificación." });
      } catch (error) { return fail(res, error); }
    },
    register: async (req, res) => {
      try {
        await service.register(req.body || {});
        return res.status(202).send({ status: "success", message: "Si el correo puede registrarse, recibirás un enlace de verificación." });
      } catch (error) { return fail(res, error); }
    },
    verify: async (req, res) => {
      try {
        await service.verify(req.params.token, { ip: req.ip, userAgent: req.get("user-agent") });
        return res.status(200).send({ status: "success", message: "Tu cuenta ADMIN está lista. Inicia sesión para configurar tu organización." });
      } catch (error) { return fail(res, error); }
    },
  };
}
module.exports = createAdminRegistrationController();
module.exports.createAdminRegistrationController = createAdminRegistrationController;

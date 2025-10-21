"use strict";

exports.validateStatus = function (req, res, next) {
  const status = req.body.status;
  const isActive =
    typeof status === "string" && status.trim().toLowerCase() === "active";

  if (isActive) return next();

  return res.status(500).send({
    status: "error",
    message:
      "no puede hacer ninguna accion mientras el condominio esta en estatus inactivo",
  });
};

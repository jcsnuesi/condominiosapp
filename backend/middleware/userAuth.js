const { canAccessCondominium } = require("../service/authorization");

exports.adminAuth = function (req, res, next) {
  let params = req.user.role;

  const allowedRoles = ["ADMIN", "STAFF_ADMIN"];

  if (!allowedRoles.includes(params)) {
    return res.status(403).send({
      status: "forbidden",
      message: "You are not authorized, only admin can access this route",
    });
  }

  next();
};

exports.ownerAuth = function (req, res, next) {
  let params = req.user.role;
  const alllowedRoles = ["OWNER", "FAMILY"];

  if (!alllowedRoles.includes(params)) {
    return res.status(403).send({
      status: "forbidden",
      message: "You are not authorized",
    });
  }
  next();
};

exports.ownerOnly = function (req, res, next) {
  if (String(req.user?.role || "").toUpperCase() !== "OWNER") {
    return res.status(403).send({
      status: "forbidden",
      code: "OWNER_REQUIRED",
      message: "Only an owner can manage family accounts",
    });
  }
  next();
};

exports.requireActiveResidentCondominium = function (req, res, next) {
  const role = String(req.user?.role || "").toUpperCase();
  if (!["OWNER", "FAMILY"].includes(role)) {
    return next();
  }

  const condominiumId =
    req.body?.condominiumId ||
    req.body?.condoId ||
    req.body?.addressId ||
    req.body?.propertyId ||
    req.params?.condoId;

  if (!condominiumId || !canAccessCondominium(req.auth, condominiumId)) {
    return res.status(403).send({
      status: "forbidden",
      code: "RESIDENT_CONDOMINIUM_INACTIVE",
      message: "This resident does not have active access to the condominium",
    });
  }

  next();
};

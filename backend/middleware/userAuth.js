exports.authorization = function (req, res, next) {
  let params = req.user.role;

  if (params != "SUPERUSER") {
    return res.status(403).send({
      status: "forbidden",
      message: "You are not authorized",
    });
  }

  next();
};

exports.adminAuth = function (req, res, next) {
  let params = req.user.role;
  console.log("ADMIN AUTH:", params);
  const allowedRoles = ["ADMIN", "STAFF"];

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

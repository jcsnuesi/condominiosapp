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

  if (params != "ADMIN") {
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
  console.log("OWNER AUTH:", params);
  if (!alllowedRoles.includes(params)) {
    return res.status(403).send({
      status: "forbidden",
      message: "You are not authorized",
    });
  }
  next();
};

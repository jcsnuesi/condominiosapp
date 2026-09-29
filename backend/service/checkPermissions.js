exports.checkPermissionsToUpdate = function (req, res, next) {
  // console.log("Checking permissions to update");
  // console.log("BODY", req.body);
  if (Object.prototype.hasOwnProperty.call(req.body, "permissions")) {
    const perm = "update";
    if (!req.body.permissions.includes(perm.toLowerCase())) {
      return res.status(403).send({
        status: "forbidden",
        message: "No tienes permisos para actualizar permisos",
      });
    }
  }
  next();
};

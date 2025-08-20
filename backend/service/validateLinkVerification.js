const Owner = require("../models/owners");
const StaffAdmin = require("../models/staff_admin");
const Staff = require("../models/staff");
const Admin = require("../models/admin");

exports.emailVerification = async (req, res) => {
  try {
    let userFound = await Promise.all([
      Owner.findOne({ email: req.params.email }),
      StaffAdmin.findOne({ email: req.params.email }),
      Staff.findOne({ email: req.params.email }),
    ]);

    if (!userFound) {
      return res.status(404).send({
        status: "error",
        message: "User not found",
      });
    }
    let document = userFound.filter((doc) => doc !== null)[0];

    document.emailVerified = true;

    const userUpdated = await Promise.all([
      Owner.findOneAndUpdate({ email: req.params.email }, document, {
        new: true,
      }),
      StaffAdmin.findOneAndUpdate({ email: req.params.email }, document, {
        new: true,
      }),
      Staff.findOneAndUpdate({ email: req.params.email }, document, {
        new: true,
      }),
    ]);

    if (!userUpdated) {
      return res.status(500).send({
        status: "error",
        message: "User not updated",
      });
    }

    return res.status(200).send({
      status: "success",
      verified: userFound.emailVerified,
    });
  } catch (err) {
    console.error("Error in email verification:", err);
    return res.status(500).send({
      status: "error",
      message: "Server error, try again",
    });
  }
};

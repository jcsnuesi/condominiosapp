let bcrypt = require("bcrypt");
let saltRounds = 10;
const Admin = require("../models/admin");
const Staff_Admin = require("../models/staff_admin");
const Staff = require("../models/staff");
const Owner = require("../models/owners");
const Family = require("../models/family");

exports.passwordVerified = async function (req, res) {
  try {
    let params = req.body;

    if (params.password.length < 8) {
      return res.status(400).send({
        status: "error",
        message: "Password must be at least 8 characters long",
      });
    }

    const userFound = await Promise.all([
      Admin.findOne({ $and: [{ id: params._id }, { email: params.email }] }),
      Staff_Admin.findOne({
        $and: [{ id: params._id }, { email: params.email }],
      }),
      Staff.findOne({ $and: [{ id: params._id }, { email: params.email }] }),
      Owner.findOne({ $and: [{ id: params._id }, { email: params.email }] }),
      Family.findOne({ $and: [{ id: params._id }, { email: params.email }] }),
    ]);

    let user = userFound.find((user) => user !== null);

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "User not found",
      });
    }

    let new_password = await bcrypt.hash(params.password, saltRounds);
    await Promise.all([
      Admin.findOneAndUpdate(
        { _id: user._id },
        { password: new_password, first_password_changed: true },
        { new: true }
      ),
      Staff_Admin.findOneAndUpdate(
        { _id: user._id },
        { password: new_password, first_password_changed: true },
        { new: true }
      ),
      Staff.findOneAndUpdate(
        { _id: user._id },
        { password: new_password, first_password_changed: true },
        { new: true }
      ),
      Owner.findOneAndUpdate(
        { _id: user._id },
        { password: new_password, first_password_changed: true },
        { new: true }
      ),
      Family.findOneAndUpdate(
        { _id: user._id },
        { password: new_password, first_password_changed: true },
        { new: true }
      ),
    ]);

    return res.status(200).send({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

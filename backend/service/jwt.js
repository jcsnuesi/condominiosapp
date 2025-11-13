"use strict";

var jwt = require("jwt-simple");
const { getUnixTime, addDays, addHours } = require("date-fns");
var secret = "clave-nueva-para-cleanning-2023";

exports.createToken = function (user) {
  var payload = {
    sub: user._id,
    email: user.email,
    password: user.password,
    role: user.role,
    iat: getUnixTime(new Date()),
    exp: getUnixTime(addDays(new Date(), 30)),
  };

  return jwt.encode(payload, secret);
};

exports.ownerRegisterToken = function (user) {
  var payload = {
    sub: user.id,
    condominioId: user.condominioId,
    role: user.role,
    iat: getUnixTime(new Date()),
    exp: getUnixTime(addDays(new Date(), 7)),
  };

  return jwt.encode(payload, secret);
};

exports.emailVerification = function (info) {
  var payload = {
    id: info.id,
    uid: info.uid,
    iat: getUnixTime(new Date()),
    exp: getUnixTime(addDays(new Date(), 30)),
  };

  return jwt.encode(payload, secret);
};

exports.guestVerification = function (info) {
  var payload = {
    id: info._id,
    fullname: info.fullname,
    email: info.notificationType,
    phone: info.phone,
    iat: getUnixTime(new Date()),
    exp: getUnixTime(addHours(new Date(), 24)),
  };

  return jwt.encode(payload, secret);
};

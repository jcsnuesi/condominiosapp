"use strict";

const { body, param, validationResult } = require("express-validator");
const apiResponse = require("../service/apiResponse");

const loginValidation = [
  body("email").trim().isEmail().withMessage("Email invalido"),
  body("password")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Password es requerido"),
  body("gettoken")
    .optional()
    .isBoolean()
    .withMessage("gettoken debe ser booleano"),
  body("rememberMe")
    .optional()
    .isBoolean()
    .withMessage("rememberMe debe ser booleano"),
];

const forgotPasswordValidation = [
  body("email").trim().isEmail().withMessage("Email invalido"),
];

const resetPasswordValidation = [
  body("token")
    .isString()
    .trim()
    .isLength({ min: 24 })
    .withMessage("Token de recuperacion invalido"),
  body("password")
    .isString()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password debe tener al menos 8 caracteres"),
];

const bookingValidation = [
  body("condoId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("condoId es requerido"),
  body("checkIn")
    .isISO8601()
    .withMessage("checkIn debe ser una fecha ISO8601 valida"),
  body("checkOut")
    .if(body("isguest").not().equals(true))
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("checkOut debe ser una fecha ISO8601 valida"),
  body("memberModel")
    .optional()
    .isIn(["Owner", "Family"])
    .withMessage("memberModel invalido"),
  body("isguest")
    .optional()
    .isBoolean()
    .withMessage("isguest debe ser booleano"),
  body("areaId")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .notEmpty()
    .withMessage("areaId debe ser un texto valido"),
  body("areaToReserve")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .notEmpty()
    .withMessage("areaToReserve debe ser un texto valido"),
  body().custom((value) => {
    const area = value.areaToReserve || value.areaId;
    if (!value.isguest && !area) {
      throw new Error("Se requiere areaId o areaToReserve para reservas");
    }

    return true;
  }),
];

const filenameValidation = [
  param("filename")
    .isString()
    .trim()
    .matches(/^[a-zA-Z0-9._-]+$/)
    .withMessage("filename contiene caracteres no permitidos"),
];

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return apiResponse.failure(
    res,
    400,
    {
      message: "Invalid request data",
      details: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    },
    "VALIDATION_ERROR"
  );
}

module.exports = {
  bookingValidation,
  forgotPasswordValidation,
  filenameValidation,
  loginValidation,
  resetPasswordValidation,
  validateRequest,
};

"use strict";

function success(res, statusCode, data, code) {
  return res.status(statusCode).send({
    success: true,
    data,
    error: null,
    code,
  });
}

function failure(res, statusCode, error, code) {
  return res.status(statusCode).send({
    success: false,
    data: null,
    error,
    code,
  });
}

module.exports = {
  success,
  failure,
};

"use strict";

module.exports = class VerifyData {
  constructor() {}

  phonesTransformation(phoneNumber) {
    const phoneDirty = phoneNumber.replace(/[ -]/g, "");

    if (phoneDirty.length >= 10) {
      return phoneDirty;
    } else {
      throw new Error("Phone number must have 10 digits");
    }
  }

  phoneFormat(req, res, next) {
    const params = req.body;
    params.forEach((element) => {
      element.phone = element.phone.replace(/[-() ]/g, "");
      element.phone2 = element.phone2.replace(/[-() ]/g, "");
    });
    next();
  }

  validKeys(req, res, next) {
    const params = req.body;
    const condoKeys = [
      "avatar",
      "alias",
      "typeOfProperty",
      "phone",
      "phone2",
      "street_1",
      "street_2",
      "sector_name",
      "availableUnits",
      "city",
      "province",
      "zipcode",
      "country",
      "socialAreas",
      "mPayment",
      "paymentDate",
      "invoiceDueDate",
      "status",
      "createdBy",
    ];

    params.forEach((element) => {
      Object.keys(element).forEach((key) => {
        if (!condoKeys.includes(key)) {
          delete element[key];
        }
      });
    });
    next();
  }
};

"use strict";

var fs = require("fs");
var path = require("path");
var Invoice = require("../models/invoice");
var Condominium = require("../models/condominio");
var moment = require("moment");
const cron = require("node-cron");
var validation = require("validator");
const PDFDocument = require("pdfkit");
const Owner = require("../models/owners");
const { model } = require("mongoose");

var invoiceController = {
  createInvoice: async function (req, res) {
    let allow = ["ADMIN", "OWNER"];

    if (!allow.includes(req.user.role)) {
      return res.status(400).send({
        status: "forbidden",
        message: "No authorized.",
      });
    }

    var params = req.body;

    /* Refactorizar metodo invoice:
    1. Se requiere crear numero de factura al crearla - Done!
    2. Crear metodo para confirmar que no esta duplicada la factura - Done!

*/

    try {
      !validation.isEmpty(params.issueDate);
      !validation.isEmpty(params.ownerId);
      !validation.isEmpty(params.condominiumId);
      !validation.isEmpty(params.paymentDescription);
      !validation.isEmpty(params.amount);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Error in the request. Try again.",
      });
    }

    let invoices = await Invoice.find({ ownerId: params.invoiceOwner });

    let invoiceFound = invoices.filter(
      (invoice) =>
        invoice.ownerId === params.ownerId &&
        invoice.issueDate.toString().split("T")[0] === params.issueDate &&
        invoice.paymentDescription === params.paymentDescription
    );

    if (invoiceFound.length > 0) {
      return res.status(400).send({
        status: "error",
        message: "Invoice already exists.",
      });
    }

    const newInvoice = new Invoice();

    for (const key in params) {
      newInvoice[key] = params[key];
    }

    newInvoice.createdBy = req.user.sub;

    try {
      await newInvoice.save();
    } catch (error) {
      console.log(error);
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Error creating invoice. Try again.",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Invoice created successfully.",
    });
  },
  generateInvoice: async function (req, res) {
    // Generar facturas automáticamente el primer día de cada mes
    var params = req.body;
    const condominiums = await Condominium.findOne({
      _id: params.condominiumId,
      status: { $ne: "inactive" },
    }).populate("units_ownerId", "email name lastname  phone id_number");

    const resInfo = new Array(condominiums);

    try {
      for (const condominium of resInfo) {
        const invoices = await Invoice.find({
          condominiumId: condominium._id,
          invoice_status: "new",
        });

        if (
          invoices.length > 0 &&
          new Date(invoices[0].invoice_due) < new Date()
        ) {
          for (const invoice of invoices) {
            invoice[0].invoice_status = "expired";
            await invoice.save();
          }
        }

        condominium.units_ownerId.forEach(async (element) => {
          const newInvoice = new Invoice({
            invoice_issue: new Date(),
            invoice_due: moment().add(1, "month").toDate(),
            invoice_amount: condominium.mPayment,
            invoice_status: "new",
            invoice_description: condominium.description,
            condominiumId: condominium._id,
            createdBy: req.user.sub,
            ownerId: element._id,
          });
          await newInvoice.save();
        });
      }
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Invoices not generated, try again.",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Invoices generated successfully.",
    });
  },
  getInvoices: function (req, res) {
    var userId = req.params.id.includes("properties")
      ? req.params.id.split("-")[0]
      : req.params.id;

    Invoice.find({ ownerId: userId })
      .populate({
        path: "condominiumId",
        model: "Condominium",
        select:
          "alias phone street_1 street_2 sector_name city province country",
      })
      .populate(
        "ownerId",
        "name lastname email phone id_number propertyDetails"
      )
      .exec((err, invoices) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            status: "error",
            message: "Error in the request. Try again.",
          });
        }

        if (!invoices) {
          return res.status(404).send({
            status: "error",
            message: "There are no invoices to show.",
          });
        }

        return res.status(200).send({
          status: "success",
          invoices,
        });
      });
  },
  // ,
  // invoiceByid: function (req, res) {
  //   var params = req.params.id;

  //   Invoice.findById(params)
  //     .populate(
  //       "condominiumId",
  //       "alias phone street_1 street_2 sector_name city province country"
  //     )
  //     .populate(
  //       "ownerId",
  //       "name lastname email phone id_number propertyDetails"
  //     )
  //     .exec(async (err, invoice) => {
  //       if (err) {
  //         return res.status(500).send({
  //           status: "error",
  //           message: "Error in the request. Try again.",
  //         });
  //       }

  //       if (!invoice) {
  //         return res.status(404).send({
  //           status: "error",
  //           message: "There are no invoices to show.",
  //         });
  //       }

  //       return res.status(200).send({
  //         status: "success",
  //         invoiceDetails: invoice,
  //       });
  //     });
  // }
  getInvoiceByCondo: function (req, res) {
    var params = req.params.id;

    Invoice.find({ condominiumId: params })
      .populate({
        path: "ownerId",
        model: "Owner",
        select: "name lastname email phone id_number propertyDetails",
      })
      .populate(
        "condominiumId",
        "alias phone street_1 street_2 sector_name city province country"
      )
      .exec((err, invoices) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Error in the request. Try again.",
          });
        }

        if (!invoices) {
          return res.status(404).send({
            status: "error",
            message: "There are no invoices to show.",
          });
        }

        return res.status(200).send({
          status: "success",
          invoices: invoices,
        });
      });
  },
};

module.exports = invoiceController;

"use strict";

var fs = require("fs");
var path = require("path");
var Invoice = require("../models/invoice");
var Condominium = require("../models/condominio");
const { addMonths, format, parseISO, isValid } = require("date-fns");
const cron = require("node-cron");
var validation = require("validator");
const PDFDocument = require("pdfkit");
const Owner = require("../models/owners");
const Family = require("../models/family");
const Admin = require("../models/admin");
const Staff_Admin = require("../models/staff_admin");
const Staff = require("../models/staff");
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
      // Validate required fields
      if (
        validation.isEmpty(params.issueDate) ||
        validation.isEmpty(params.ownerId) ||
        validation.isEmpty(params.condominiumId) ||
        validation.isEmpty(params.paymentDescription) ||
        validation.isEmpty(params.amount)
      ) {
        throw new Error("Missing required fields");
      }

      // Validate date format
      const issueDate = parseISO(params.issueDate);
      if (!isValid(issueDate)) {
        throw new Error("Invalid date format");
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        status: "error",
        message:
          "Invalid data provided. Check required fields and date format.",
      });
    }

    try {
      // Find existing invoices for this owner
      let invoices = await Invoice.find({ ownerId: params.ownerId });

      // Check for duplicate invoice using date-fns for date comparison
      let invoiceFound = invoices.filter((invoice) => {
        const invoiceDate = format(invoice.issueDate, "yyyy-MM-dd");
        const paramsDate = format(parseISO(params.issueDate), "yyyy-MM-dd");

        return (
          invoice.ownerId === params.ownerId &&
          invoiceDate === paramsDate &&
          invoice.paymentDescription === params.paymentDescription
        );
      });

      if (invoiceFound.length > 0) {
        return res.status(400).send({
          status: "error",
          message: "Invoice already exists for this date and description.",
        });
      }

      // Create new invoice
      const newInvoice = new Invoice();

      // Copy all parameters to the new invoice
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          newInvoice[key] = params[key];
        }
      }

      newInvoice.createdBy = req.user.sub;

      // Save the invoice
      await newInvoice.save();

      return res.status(200).send({
        status: "success",
        message: "Invoice created successfully.",
        invoice: {
          id: newInvoice._id,
          invoice_number: newInvoice.invoice_number,
          amount: newInvoice.amount,
        },
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
      return res.status(500).send({
        status: "error",
        message: "Error creating invoice. Try again.",
        details: error.message,
      });
    }
  },

  generateInvoice: async function (req, res) {
    // Generar facturas automáticamente el primer día de cada mes
    var params = req.body;

    try {
      const condominiums = await Condominium.findOne({
        _id: params.condominiumId,
        status: { $ne: "inactive" },
      }).populate("units_ownerId", "email name lastname phone id_number");

      if (!condominiums) {
        return res.status(404).send({
          status: "error",
          message: "Condominium not found or inactive.",
        });
      }

      const resInfo = [condominiums]; // Convert to array for consistency

      for (const condominium of resInfo) {
        // Find existing invoices with "new" status
        const invoices = await Invoice.find({
          condominiumId: condominium._id,
          invoice_status: "new",
        });

        // Check and update expired invoices using date-fns
        if (invoices.length > 0) {
          const currentDate = new Date();

          for (const invoice of invoices) {
            // Check if invoice is due and update status
            if (invoice.invoice_due && invoice.invoice_due < currentDate) {
              invoice.invoice_status = "expired";
              await invoice.save();
              console.log(`Invoice ${invoice._id} marked as expired`);
            }
          }
        }

        // Generate new invoices for all owners
        const invoicePromises = condominium.units_ownerId.map(async (owner) => {
          try {
            // Check if invoice already exists for this month
            const currentMonth = format(new Date(), "yyyy-MM");
            const existingInvoice = await Invoice.findOne({
              condominiumId: condominium._id,
              ownerId: owner._id,
              createdAt: {
                $gte: new Date(currentMonth + "-01"),
                $lt: addMonths(new Date(currentMonth + "-01"), 1),
              },
            });

            if (existingInvoice) {
              console.log(
                `Invoice already exists for owner ${owner._id} this month`
              );
              return null;
            }

            // Create new invoice using date-fns for date calculations
            const issueDate = new Date();
            const dueDate = addMonths(issueDate, 1);

            const newInvoice = new Invoice({
              invoice_issue: issueDate,
              invoice_due: dueDate,
              invoice_amount: condominium.mPayment,
              invoice_status: "new",
              invoice_description:
                condominium.description ||
                `Monthly fee - ${format(issueDate, "MMMM yyyy")}`,
              condominiumId: condominium._id,
              createdBy: req.user.sub,
              ownerId: owner._id,
            });

            return await newInvoice.save();
          } catch (error) {
            console.error(
              `Error creating invoice for owner ${owner._id}:`,
              error
            );
            return null;
          }
        });

        // Wait for all invoice creations to complete
        const results = await Promise.allSettled(invoicePromises);
        const successful = results.filter(
          (result) => result.status === "fulfilled" && result.value !== null
        ).length;

        console.log(
          `Generated ${successful}/${condominium.units_ownerId.length} invoices for ${condominium.alias}`
        );
      }

      return res.status(200).send({
        status: "success",
        message: "Invoices generated successfully.",
        details: {
          condominium: condominiums.alias,
          totalOwners: condominiums.units_ownerId.length,
          generatedAt: format(new Date(), "dd/MM/yyyy HH:mm:ss"),
        },
      });
    } catch (error) {
      console.error("Error generating invoices:", error);
      return res.status(500).send({
        status: "error",
        message: "Invoices not generated, try again.",
        details: error.message,
      });
    }
  },

  getInvoices: function (req, res) {
    var userId = req.params.id;

    if (!userId) {
      return res.status(400).send({
        status: "error",
        message: "User ID is required.",
      });
    }

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
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec((err, invoices) => {
        if (err) {
          console.error("Error fetching invoices:", err);
          return res.status(500).send({
            status: "error",
            message: "Error in the request. Try again.",
          });
        }

        if (!invoices || invoices.length === 0) {
          return res.status(404).send({
            status: "error",
            message: "There are no invoices to show.",
          });
        }

        // Format dates using date-fns for response
        const formattedInvoices = invoices.map((invoice) => ({
          ...invoice.toObject(),
          formattedIssueDate:
            invoice.issueDate && format(invoice.issueDate, "dd/MM/yyyy"),
          formattedDueDate:
            invoice.dueDate && format(invoice.dueDate, "dd/MM/yyyy"),
        }));

        return res.status(200).send({
          status: "success",
          invoices: formattedInvoices,
          count: invoices.length,
        });
      });
  },

  getInvoiceByIdentifier: async function (req, res) {
    var id = req.params.id;
    const role = req.user.role.toUpperCase();
    var ModelQuery = null;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Identifier is required.",
      });
    }
    let models = {
      FAMILY: Family,
      OWNER: Owner,
      ADMIN: Admin,
      STAFF_ADMIN: Staff_Admin,
      STAFF: Staff,
    };
    let query = [];

    if (role == "OWNER") {
      ModelQuery = Invoice.find({
        ownerId: id,
      });
    } else if (role == "FAMILY" || role == "STAFF_ADMIN" || role == "STAFF") {
      const ownerData = await models[role]
        .findOne({ _id: id })
        .select("createdBy");
      ModelQuery = Invoice.find({
        ownerId: ownerData.createdBy,
      });
    } else if (role == "ADMIN") {
      ModelQuery = Invoice.find({
        createdBy: id,
      });
    }

    try {
      const invoices = await ModelQuery.populate({
        path: "ownerId",
        model: "Owner",
        select: "name lastname email phone id_number propertyDetails",
      })
        .populate(
          "condominiumId",
          "alias phone street_1 street_2 sector_name city province country"
        )
        .sort({ createdAt: -1 }) // Sort by newest first
        .exec((err, invoices) => {
          if (err) {
            console.error("Error fetching invoices by identifier:", err);
            return res.status(500).send({
              status: "error",
              message: "Error in the request. Try again.",
            });
          }

          if (!invoices || invoices.length === 0) {
            return res.status(404).send({
              status: "error",
              message: "There are no invoices to show.",
            });
          }

          // Format dates using date-fns for response
          const formattedInvoices = invoices.map((invoice) => ({
            ...invoice.toObject(),
            formattedIssueDate:
              invoice.issueDate && format(invoice.issueDate, "dd/MM/yyyy"),
            formattedDueDate:
              invoice.dueDate && format(invoice.dueDate, "dd/MM/yyyy"),
            formattedCreatedAt:
              invoice.createdAt &&
              format(invoice.createdAt, "dd/MM/yyyy HH:mm"),
          }));

          return res.status(200).send({
            status: "success",
            invoices: formattedInvoices,
            count: invoices.length,
            summary: {
              total: invoices.length,
              pending: invoices.filter((inv) => inv.status === "pending")
                .length,
              paid: invoices.filter((inv) => inv.status === "paid").length,
              expired: invoices.filter(
                (inv) => inv.invoice_status === "expired"
              ).length,
            },
          });
        });
    } catch (error) {
      console.error("Error in getInvoiceByIdentifier:", error);
      return res.status(500).send({
        status: "error",
        message: "Error processing request.",
        details: error.message,
      });
    }
  },
};

module.exports = invoiceController;

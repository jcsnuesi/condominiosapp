"use strict";

var fs = require("fs");
var path = require("path");
var Invoice = require("../models/invoice");
const { TransferReceipt } = require("../models/bankReconciliation");
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
const { canAccessCondominium } = require("../service/authorization");
const { remainingInvoiceBalance } = require("../service/invoiceBalance");
const { default: mongoose } = require("mongoose");
const {
  isOwnerActiveInCondominium,
} = require("../service/residentPropertyAccess");
const {
  INVOICE_HISTORY_MONTHS,
  invoiceHistoryRange,
} = require("../service/invoiceHistoryRange");

async function invoiceAttachments(req, invoices) {
  const receipts = await TransferReceipt.find({
    organizationId: req.auth.organizationId,
    invoiceId: { $in: invoices.map((invoice) => invoice._id) },
    ...(req.user.role === "OWNER" ? { ownerId: req.user.sub } : {}),
  }).select("_id invoiceId originalName mimeType reconciliationStatus").sort({ createdAt: 1 }).lean();
  const attachments = new Map();
  for (const receipt of receipts) {
    const key = String(receipt.invoiceId);
    if (!attachments.has(key)) attachments.set(key, []);
    attachments.get(key).push(receipt);
  }
  return attachments;
}

var invoiceController = {
  createInvoice: async function (req, res) {
    const { access, condominium } = require("../service/financeAccess");
    const { issueInvoice } = require("../service/invoiceIssuance");
    const { operationKey } = require("../service/financeRules");
    const crypto = require("crypto");
    try {
      access(req, true, "finance.create");
      const condo = await condominium(req, req.body.condominiumId);
      const owner = await Owner.findOne({ _id: req.body.ownerId, organizationId: req.auth.organizationId }).lean();
      const properties = require("../service/residentPropertyAccess").activeOwnerPropertyDetails(owner, condo._id);
      const unitNumber = req.body.unitNumber || (properties.length === 1 ? properties[0].condominium_unit : null);
      const invoice = await issueInvoice({ condominium: condo, ownerId: req.body.ownerId, unitNumber, amount: req.body.amount, issueDate: req.body.issueDate, dueDate: req.body.dueDate || new Date(Date.parse(req.body.issueDate) + 30 * 86400000).toISOString().slice(0, 10), currency: req.body.currency || "DOP", chargeType: "individual", sourceKey: "legacy-api:" + operationKey(req.body.idempotencyKey || crypto.randomUUID()), description: req.body.description || req.body.paymentDescription, createdBy: req.user.sub });
      return res.status(200).send({ status: "success", message: "Invoice created successfully.", invoice: { id: invoice._id, invoice_number: invoice.invoice_number, amount: invoice.amount } });
    } catch (error) { return res.status(error.status || (error.code === 11000 ? 409 : 400)).send({ status: "error", message: error.message }); }
  },

  generateInvoice: async function (req, res) {
    const { access, condominium } = require("../service/financeAccess");
    try {
      access(req, true, "finance.create");
      const condo = await condominium(req, req.body.condominiumId);
      const details = await require("../service/invoice_job").generateCondominiumInvoices(condo);
      return res.status(details.failed ? 409 : 200).send({ status: details.failed ? "error" : "success", message: details.failed ? "Revise las unidades que no pudieron facturarse" : "Invoices generated successfully.", details });
    } catch (error) { return res.status(error.status || 400).send({ status: "error", message: error.message }); }
  },

  getInvoices: async function (req, res) {
    var userId = req.params.id;

    if (!userId) {
      return res.status(400).send({
        status: "error",
        message: "User ID is required.",
      });
    }

    try {
      const invoices = await Invoice.find({ ownerId: userId, organizationId: req.auth.organizationId })
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
        .sort({ createdAt: -1 }); // Sort by newest first

      if (!invoices || invoices.length === 0) {
        return res.status(204).send({
          status: "error",
          message: "There are no invoices to show.",
        });
      }

      const attachments = await invoiceAttachments(req, invoices);
      // Format dates using date-fns for response
      const formattedInvoices = invoices.map((invoice) => ({
        ...invoice.toObject(),
        attachments: attachments.get(String(invoice._id)) || [],
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
    } catch (err) {
      console.error("Error fetching invoices:", err);
      return res.status(500).send({
        status: "error",
        message: "Error in the request. Try again.",
      });
    }
  },

  getInvoiceByIdentifier: async function (req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
          status: "error",
          message: "A valid identifier is required.",
        });
      }
      const id = new mongoose.Types.ObjectId(req.params.id);
      const role = req.user.role.toUpperCase();
      const historyRange = invoiceHistoryRange(req.query.month);
      let models = {
        FAMILY: Family,
        OWNER: Owner,
        ADMIN: Admin,
        STAFF_ADMIN: Staff_Admin,
        STAFF: Staff,
      };

      var query = null;
      const isCondo = await Condominium.exists({
        _id: id,
        organizationId: req.auth.organizationId,
      });

      if (isCondo) {
        if (
          req.auth.scope.mode === "SELECTED" &&
          !req.auth.scope.condominiumIds.map(String).includes(String(id))
        ) {
          return res.status(403).send({
            status: "forbidden",
            message: "You do not have access to this condominium",
          });
        }
        query = {
          condominiumId: id,
        };
        if (role === "OWNER") {
          query.ownerId = req.user.sub;
        } else if (role === "FAMILY") {
          const family = await Family.findById(req.user.sub)
            .select("createdBy")
            .lean();
          query.ownerId = family?.createdBy || id;
        }
      } else if (role == "OWNER") {
        query = {
          ownerId: req.user.sub,
        };
      } else if (role == "FAMILY") {
        const ownerData = await models[role]
          .findOne({ _id: id })
          .select("createdBy");
        query = {
          ownerId: ownerData ? ownerData.createdBy : id,
        };
      } else if (role == "STAFF_ADMIN" || role == "STAFF") {
        const adminData = await models[role]
          .findOne({ _id: id })
          .select("createdBy");

        query = {
          createdBy: adminData ? adminData.createdBy : id,
        };
      } else {
        query = {
          createdBy: id,
        };
      }

      query.organizationId = req.auth.organizationId;
      query.issueDate = {
        $gte: historyRange.start,
        $lt: historyRange.end,
      };
      if (req.auth.scope.mode === "SELECTED" && !query.condominiumId) {
        query.condominiumId = { $in: req.auth.scope.condominiumIds };
      }
      const invoices = await Invoice.find(query)
        .populate({
          path: "ownerId",
          model: "Owner",
          select: "name lastname email phone id_number propertyDetails",
        })
        .populate(
          "condominiumId",
          "alias phone street_1 street_2 sector_name city province country"
        )
        .sort({ issueDate: -1 })
        .exec();

      if (!invoices || invoices.length === 0) {
        return res.status(200).send({
          status: "success",
          invoices: [],
          count: 0,
          summary: {
            total: 0,
            pending: 0,
            paid: 0,
            expired: 0,
            totalAmountDue: 0,
          },
          selectedMonth: historyRange.selectedMonth,
          retentionMonths: INVOICE_HISTORY_MONTHS,
        });
      }

      const attachments = await invoiceAttachments(req, invoices);
      // Format dates using date-fns for response
      const formattedInvoices = invoices.map((invoice) => ({
        ...invoice.toObject(),
        attachments: attachments.get(String(invoice._id)) || [],
        formattedIssueDate:
          invoice.issueDate && format(invoice.issueDate, "dd/MM/yyyy"),
        formattedDueDate:
          invoice.dueDate && format(invoice.dueDate, "dd/MM/yyyy"),
        formattedCreatedAt:
          invoice.createdAt && format(invoice.createdAt, "dd/MM/yyyy HH:mm"),
      }));

      let pendingAmout = invoices.reduce((sum, inv) => sum + remainingInvoiceBalance(inv), 0);
      return res.status(200).send({
        status: "success",
        invoices: formattedInvoices,
        count: invoices.length,
        summary: {
          total: invoices.length,
          pending: invoices.filter((inv) => remainingInvoiceBalance(inv) > 0).length,
          paid: invoices.filter(
            (inv) =>
              inv.status === "completed" || inv.paymentStatus === "completed"
          ).length,
          expired: invoices.filter((inv) => inv.status === "overdue").length,
          totalAmountDue: pendingAmout,
        },
        selectedMonth: historyRange.selectedMonth,
        retentionMonths: INVOICE_HISTORY_MONTHS,
      });
    } catch (error) {
      console.error("Error in getInvoiceByIdentifier:", error);
      return res.status(error.statusCode || 500).send({
        status: "error",
        message: error.statusCode ? error.message : "Error processing request.",
        details: error.message,
      });
    }
  },

  getInvoiceSummaryByIdentifier: async function (req, res) {
    var id = new mongoose.Types.ObjectId(req.params.id);
    const role = req.user.role.toUpperCase();

    try {
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

      var query = null;
      const isCondo = await Condominium.exists({ _id: id });

      if (isCondo) {
        query = { condominiumId: id };
      } else if (role == "OWNER") {
        query = { ownerId: id };
      } else if (role == "FAMILY") {
        const ownerData = await models[role]
          .findOne({ _id: id })
          .select("createdBy")
          .lean();
        query = { ownerId: ownerData ? ownerData.createdBy : id };
      } else if (role == "STAFF_ADMIN" || role == "STAFF") {
        const adminData = await models[role]
          .findOne({ _id: id })
          .select("createdBy")
          .lean();
        query = { createdBy: adminData ? adminData.createdBy : id };
      } else {
        query = { createdBy: id };
      }

      query.organizationId = req.auth.organizationId;
      if (req.auth.scope.mode === "SELECTED" && !query.condominiumId) {
        query.condominiumId = { $in: req.auth.scope.condominiumIds };
      }
      const invoices = await Invoice.find(query)
        .select("amount paidAmount adjustmentAmount creditAppliedAmount balancePending status paymentStatus createdAt")
        .sort({ createdAt: -1 })
        .lean();

      if (!invoices || invoices.length === 0) {
        return res.status(200).send({
          status: "success",
          monthly: [],
          summary: {
            total: 0,
            pending: 0,
            paid: 0,
            expired: 0,
            totalAmountDue: 0,
          },
        });
      }

      const monthlyMap = new Map();
      let pending = 0;
      let paid = 0;
      let expired = 0;
      let totalAmountDue = 0;

      invoices.forEach((invoice) => {
        const date = new Date(invoice.createdAt);
        const month = date.getMonth();
        const year = date.getFullYear();
        const key = `${year}-${month}`;

        if (!monthlyMap.has(key)) {
          monthlyMap.set(key, {
            month,
            year,
            paid: 0,
            unpaid: 0,
          });
        }

        const row = monthlyMap.get(key);
        const isPending = remainingInvoiceBalance(invoice) > 0;
        const isPaid =
          invoice.status === "paid" || invoice.paymentStatus === "completed";
        const isExpired = invoice.status === "expired";

        if (isPaid) {
          row.paid += 1;
          paid += 1;
        } else {
          row.unpaid += 1;
        }

        if (isPending) {
          pending += 1;
          totalAmountDue += remainingInvoiceBalance(invoice);
        }

        if (isExpired) {
          expired += 1;
        }
      });

      const monthly = Array.from(monthlyMap.values()).sort(
        (a, b) => a.year - b.year || a.month - b.month
      );

      return res.status(200).send({
        status: "success",
        monthly,
        summary: {
          total: invoices.length,
          pending,
          paid,
          expired,
          totalAmountDue,
        },
      });
    } catch (error) {
      console.error("Error in getInvoiceSummaryByIdentifier:", error);
      return res.status(500).send({
        status: "error",
        message: "Error processing request.",
        details: error.message,
      });
    }
  },
};

module.exports = invoiceController;

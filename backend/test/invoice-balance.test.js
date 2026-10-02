"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { remainingInvoiceBalance } = require("../service/invoiceBalance");

test("balances preserve legacy invoices and subtract accumulated partial payments", () => {
  assert.equal(remainingInvoiceBalance({ amount: 5000 }), 5000);
  assert.equal(remainingInvoiceBalance({ amount: 5000, paidAmount: 3000 }), 2000);
  assert.equal(remainingInvoiceBalance({ amount: 5000, paidAmount: 5000 }), 0);
  assert.equal(remainingInvoiceBalance({ amount: 5000, paymentStatus: "completed" }), 0);
  assert.equal(remainingInvoiceBalance({ amount: 5000, paidAmount: 6000 }), 0);
  assert.equal(remainingInvoiceBalance({ amount: 0.3, paidAmount: 0.1 }), 0.2);
});

'use strict'

const express = require('express')
const router = express.Router()
const InvoiceController = require('../controllers/invoice')
const md_auth = require('../middleware/auth')
 
router.post('/create-invoice', md_auth.authenticated, InvoiceController.createInvoice)
router.post('/generate-invoice', md_auth.authenticated, InvoiceController.generateInvoice)

module.exports = router
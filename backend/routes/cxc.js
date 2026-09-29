'use strict'

const express = require('express')
const router = express.Router()
const CxcController = require('../controllers/cxc')
const md_auth = require('../middleware/auth')

router.get('/probado', md_auth.authenticated, CxcController.generateInvoice)

module.exports = router
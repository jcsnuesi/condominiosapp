'use strict'

let express = require('express')
let PropertyController = require('../controllers/property')

let md_auth = require('../middleware/auth')
let router = express.Router()

let multyParty =  require('connect-multiparty')
let md_uplaod = multyParty({ uploadDir: './uploads/properties'})

 
// GET
router.get('/propertiesCustomer', md_auth.authenticated, PropertyController.getPropery)
router.get('/properties', md_auth.authenticated, PropertyController.getProperies)
router.get('/property-page/:page', md_auth.authenticated, PropertyController.propertyPagination);

// POST

router.post('/createProperty', [md_auth.authenticated],PropertyController.createProperty )

// PUT

router.put('/updateProperty', [md_auth.authenticated, md_uplaod], PropertyController.propertyUpdate)

// DELETE

router.delete('/deleteproperty/:id', md_auth.authenticated, PropertyController.propertyDelete )


module.exports =  router
'use strict' 
 
let express = require('express')
let condominioController = require('../controllers/condominio')

let md_auth = require('../middleware/auth') 
let router = express.Router()

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/properties' });
var adminAuth = require('../middleware/userAuth')
// GET

router.get('/condominios', md_auth.authenticated, condominioController.getCondominiumByAdmin);
 

router.get('/condominioById', condominioController.getCondominiumById);
router.get('/condominioByAdmin/:id', condominioController.getCondominiumsByAdmin);
router.get('/buildingDetail/:id', condominioController.getBuildingDetails);
router.get('/avatarCondominios/:avatar', condominioController.getAvatar);

router.get('/condominio-page/:page', md_auth.authenticated, condominioController.CondominiumPagination);

// POST

router.post('/create-condominio', [md_auth.authenticated, md_upload, adminAuth.adminAuth], condominioController.createCondominium)
// router.post('/create-Apartment', md_auth.authenticated, condominioController.createApartment)

// PUT

router.put('/updateCondominio', md_auth.authenticated, condominioController.CondominiumUpdate)

// DELETE

router.delete('/deleteproperty', md_auth.authenticated, condominioController.CondominiumDelete)


module.exports = router;
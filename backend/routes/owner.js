
let express = require('express')
let ownerController = require('../controllers/owner')
let md_auth = require('../middleware/auth')
let emailRegisterGenerator = require('../middleware/emailOwnerRegister')
let router = express.Router()

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/owner' });


router.get('/customers', md_auth.authenticated, ownerController.ownerByAdim )

// verify email
router.get('/verify-email/:email', ownerController.emailVerification)


// create owner
router.post('/create-owner/:token', [md_upload, md_auth.emailOwnerRegistration], ownerController.createOwner)

// invite owner
router.post('/owner-register', [md_auth.authenticated], emailRegisterGenerator.emailOwnerRegister)


router.post('/create-occupant', [md_upload, md_auth.authenticated], ownerController.secundaryAcc)


router.put('/update-owner', md_auth.authenticated, ownerController.update)

router.put('/delete-user-account', md_auth.authenticated, ownerController.deleteOccupantByOwner)



module.exports =  router
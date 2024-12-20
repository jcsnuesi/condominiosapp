 
let express = require('express')
let ownerController = require('../controllers/owner')
let md_auth = require('../middleware/auth')
let emailRegisterGenerator = require('../controllers/whatsappController')
let router = express.Router()
let md_ws = require('../middleware/whatsappAuth')

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/owner' });
 

router.get('/customers', md_auth.authenticated, ownerController.ownerByAdmin )
router.get('/owner-avatar/:avatar', ownerController.getAvatar )
router.get('/condominioByOwnerId', md_auth.authenticated, ownerController.getCondominiumByOwnerId);
router.get("/get-family", md_auth.authenticated, ownerController.getFamily)
router.get("/get-familyMembers/:id", md_auth.authenticated, ownerController.getFamilyByOwnerId)
router.get("/family-member-details/:id", md_auth.authenticated, ownerController.getFamilyDetailsById)

// verify email
router.get('/verify-email/:email', ownerController.emailVerification)

// create owner
router.post('/create-owner', [md_upload, md_auth.emailOwnerRegistration], ownerController.createSingleOwner)

// // invite owner
// router.post('/owner-register', [md_auth.authenticated], emailRegisterGenerator.emailOwnerRegister)


router.post('/create-family', [md_upload, md_auth.authenticated], ownerController.secundaryAcc)


router.put('/update-owner', md_auth.authenticated, ownerController.update)

router.put('/delete-user-account', md_auth.authenticated, ownerController.deleteOccupantByOwner)

router.put('/add-prop-family', md_auth.authenticated, ownerController.addFamilyProperty)

router.put('/update-family-auth', md_auth.authenticated, ownerController.authFamily)

module.exports =  router
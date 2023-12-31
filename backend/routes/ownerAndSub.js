
let express = require('express')
let ownerController = require('../controllers/ownerAndSub')

let md_auth = require('../middleware/auth')
let router = express.Router()

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/owner' });


router.get('/customers', md_auth.authenticated, ownerController.ownerByAdim )

router.post('/create-owner',[md_upload, md_auth.authenticated], ownerController.createUser)

router.post('/create-occupant', [md_upload, md_auth.authenticated], ownerController.secundaryAcc)


router.put('/update-owner', md_auth.authenticated, ownerController.update)

router.put('/delete-user-account', md_auth.authenticated, ownerController.deleteOccupantByOwner)



module.exports =  router
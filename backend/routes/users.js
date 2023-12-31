'use strict'

var express = require('express')
var UserController = require('../controllers/users')
 

var router =  express.Router()
var md_auth = require('../middleware/auth')
var userAuth = require('../middleware/userAuth')

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });



// GET

router.get('/admins', [md_auth.authenticated, userAuth.authorization], UserController.getAdmins)
router.get('/main-avatar/:fileName', UserController.getAvatar)

// Buscar usuario por propietario
// router.get('/ownerUsers', md_auth.authenticated, UserController.getUsersByOwner)


// POST 
router.post('/createAccount', [md_auth.authenticated, md_upload, userAuth.authorization], UserController.createUser)
router.post('/login', UserController.login)

// PUT

router.put('/update-account', md_auth.authenticated, UserController.update)
router.put('/inactive-account', md_auth.authenticated, UserController.delete)
router.put('/inactive-owner', md_auth.authenticated, UserController.deleteOwner)
router.put('/avatar-admin', [md_auth.authenticated, md_upload], UserController.avatar)

// DELETE

// router.delete('/deleteAccount', md_auth.authenticated, UserController.delete)

module.exports = router
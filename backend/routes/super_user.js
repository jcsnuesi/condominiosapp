'use strict'

var express = require('express')
var SuperUserController = require('../controllers/super_user')


var router =  express.Router()
var md_auth = require('../middleware/auth')

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });



// GET



// Buscar usuario por propietario
// router.get('/ownerUsers', md_auth.authenticated, UserController.getUsersByOwner)


// // POST
// router.post('/createAccount', md_upload, UserController.createUser)
// // router.post('/createUserByOwner', md_auth.authenticated, UserController.createUserByOwner)
router.post('/login-super', SuperUserController.login)
router.post('/create-super', SuperUserController.create)

// // PUT

// router.put('/update-account', md_auth.authenticated, UserController.update)
// router.put('/inactive-account', md_auth.authenticated, UserController.delete)
// router.put('/avatar-admin', [md_auth.authenticated, md_upload], UserController.avatar)

// DELETE

// router.delete('/deleteAccount', md_auth.authenticated, UserController.delete)

module.exports = router
'use strict'

var express = require('express')
var StaffController = require('../controllers/staff')

var router = express.Router() 
var md_auth = require('../middleware/auth')


var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/staff' });

// GET

router.get('/staffs', md_auth.authenticated, StaffController.getStaffByAdmin)
router.get('/avatar-staff/:avatar',  StaffController.getAvatar)


// POST

router.post('/create-staff', [md_auth.authenticated], StaffController.createStaff)

// // Buscar usuario por propietario


// // POST
// router.post('/createAccount', md_upload, UserController.createUser)
// router.post('/createUserByOwner', md_auth.authenticated, UserController.createUserByOwner)
// router.post('/login', UserController.login)

// // PUT

// router.put('/updateAccount', [md_auth.authenticated, md_upload], UserController.update)
router.put('/update-staff', md_auth.authenticated, StaffController.update)

// // DELETE

router.put('/delete-staff', md_auth.authenticated, StaffController.deleteBatch)

module.exports = router
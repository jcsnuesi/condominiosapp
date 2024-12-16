'use strict'

var express = require('express')
var ReserveController = require('../controllers/reserves')


var router = express.Router()
var md_auth = require('../middleware/auth')

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });


// GET

// router.get('/allReservation', md_auth.authenticated, ReserveController.getAllReservation)
router.get('/findReservation/:apartment/:addressId', md_auth.authenticated, ReserveController.getReservationByBooker)
router.get('/get-bookings/:id', md_auth.authenticated, ReserveController.getAllBookingByCondoAndUnit)

// // Buscar usuario por propietario
// router.get('/ownerUsers', md_auth.authenticated, UserController.getUsersByOwner)


// POST
router.post('/create-booking', md_auth.authenticated, ReserveController.createBooking)
// router.post('/createUserByOwner', md_auth.authenticated, UserController.createUserByOwner)
// router.post('/login', UserController.login)

// PUT

router.put('/updateReservation', md_auth.authenticated, ReserveController.updateReservation)
// router.put('/updateOwnersUsers', [md_auth.authenticated, md_upload], UserController.updateOwnersUsers)

// // DELETE

router.delete('/deleteReservation/:id', md_auth.authenticated, ReserveController.deleteReservation)

module.exports = router
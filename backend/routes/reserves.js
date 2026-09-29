"use strict";

var express = require("express");
var ReserveController = require("../controllers/reserves");

var router = express.Router();
var {
  authenticated,
  ownerAuth,
  checkAvailability,
  validateBookingData,
} = require("../middleware/middleware_bundle");

const {
  bookingValidation,
  validateRequest,
} = require("../middleware/requestValidation");

var multipart = require("connect-multiparty");
var md_upload = multipart({ uploadDir: "./uploads/users" });

/**
 * Middleware para validar la disponibilidad de la reserva:
 * - Verifica que la fecha de inicio y fin no se solapen con otras reservas existentes
 * - Verifica que la fecha de inicio sea posterior a la fecha actual
 * - Verifica que la unidad/amenidad esté disponible para reservar
 * - Actualizar reservas expiradas
 */

// GET

router.get(
  "/get-bookings/:id",
  authenticated,
  ReserveController.getAllBookingByCondoAndUnit
);
router.get(
  "/get-bookings-count/:id",
  authenticated,
  ReserveController.getBookingsCountByIdentifier
);

// router.get('/allReservation', md_auth.authenticated, ReserveController.getAllReservation)
// router.get('/findReservation/:apartment/:addressId', md_auth.authenticated, ReserveController.getReservationByBooker)

// // Buscar usuario por propietario
// router.get('/ownerUsers', md_auth.authenticated, UserController.getUsersByOwner)

// POST
router.post(
  "/create-booking",
  [
    authenticated,
    ownerAuth,
    ...bookingValidation,
    validateRequest,
    checkAvailability,
    validateBookingData,
  ],
  ReserveController.createBooking
);

// router.post('/createUserByOwner', md_auth.authenticated, UserController.createUserByOwner)
// router.post('/login', UserController.login)

// PUT

router.put(
  "/update-booking",
  authenticated,
  ReserveController.updateReservation
);
// router.put('/updateOwnersUsers', [md_auth.authenticated, md_upload], UserController.updateOwnersUsers)

// // DELETE

router.delete(
  "/deleteReservation/:id",
  authenticated,
  ReserveController.deleteReservation
);
router.delete(
  "/deleteReservations",
  authenticated,
  ReserveController.deleteReservations
);

module.exports = router;

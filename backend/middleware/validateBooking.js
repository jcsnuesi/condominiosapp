"use strict";

const Reserves = require("../models/reserves");
const Booking = require("../models/reserves");

exports.checkAvailability = async (req, res, next) => {
  try {
    const { areaToReserve, condoId, checkIn, checkOut } = req.body;

    // Verificar si existe una reserva que se solape
    const existingBooking = await Booking.findOne({
      condoId,
      areaToReserve,
      $or: [
        {
          checkIn: { $lt: checkOut },
          checkOut: { $gt: checkIn },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).send({
        status: "error",
        message: "El horario seleccionado no está disponible",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al verificar disponibilidad",
    });
  }
};

exports.validateBookingData = (req, res, next) => {
  const { areaId, condoId, checkIn, checkOut } = req.body;

  // Validar formato de fecha y hora
  if (!checkIn || !condoId) {
    return res.status(400).send({
      status: "error",
      message: "Datos de reserva incompletos",
    });
  }

  // Validar que la fecha no sea pasada
  if (new Date(checkIn) < new Date()) {
    return res.status(400).send({
      status: "error",
      message: "No se pueden hacer reservas en fechas pasadas",
    });
  }

  next();
};

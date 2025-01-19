"use strict";

const Reserves = require("../models/reserves");

exports.checkAvailability = async (req, res, next) => {
  try {
    const { areaId, condoId, checkIn, checkOut } = req.body;

    // Verificar si existe una reserva que se solape
    const existingBooking = await Reserves.findOne({
      condoId: condoId,
      areaId: areaId,
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
        message: "The selected time slot is not available",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error checking availability",
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

// Función para actualizar reservas vencidas
exports.updateExpiredBookings = async () => {
  try {
    const currentDate = new Date();
    console.log("currentDate--->", currentDate);

    // Buscar reservas que ya pasaron su fecha de checkOut y aún están activas
    const expiredBookings = await Reserves.find({
      checkOut: { $lt: currentDate },
      status: "Reserved",
    });
    console.log("currentDate--->", expiredBookings);

    // Actualizar el estado de las reservas vencidas
    for (const booking of expiredBookings) {
      booking.status = "expired";
      await Reserves.findByIdAndUpdate(booking._id, { status: "expired" });
    }

    console.log(`${expiredBookings.length} reservas vencidas actualizadas`);
  } catch (error) {
    console.error("Error al actualizar reservas vencidas:", error);
  }
};

// Ejecutar la verificación cada 24 horas
setInterval(exports.updateExpiredBookings, 24 * 60 * 60 * 1000);

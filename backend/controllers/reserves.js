"use strict";

const Reserves = require("../models/reserves");
const Owner = require("../models/owners");
const Family = require("../models/family");
const Condo = require("../models/condominio");
const Staff = require("../models/staff");
// const uuid = uuidv4();
let validator = require("validator");
let errorHandler = require("../error/errorHandler");

let isDateConflict = require("../service/dateConflict");
let codeVerification = require("../service/generateVerification");
let generateRandomCode = require("../service/codeGenerator");
let bcrypt = require("bcrypt");
let saltRounds = 10;
let verifyGuest = require("../service/jwt");
const { default: mongoose } = require("mongoose");

var reservesController = {
  createBooking: async function (req, res) {
    //Capturar los datos
    var params = req.body;

    try {
      var val_condoId = !validator.isEmpty(params.condoId);
    } catch (error) {
      return res.status(400).send({
        status: "error",
        message: "All field must be fill out",
      });
    }

    if (val_condoId) {
      try {
        var user = { OWNER: Owner, FAMILY: Family };

        const userInfo = await user[req.user.role].findOne({
          _id: req.user.sub,
        });
        if (!userInfo) {
          return res.status(404).send({
            status: "error",
            message: "Owner not found",
          });
        }

        const reservation = new Reserves();

        if (params.isguest) {
          reservation.condoId = params.condoId;
          reservation.apartmentUnit = params.unit;
          reservation.memberId = req.user.sub;
          reservation.bookingName = userInfo.name + " " + userInfo.lastname;
          reservation.phone = userInfo.phone;
          reservation.guest.push({
            fullname: params.fullname,
            phone: params.phone,
            notificationType: params.notifing,
            verificationCode: generateRandomCode(),
            verify: false,
            guest_token: verifyGuest.guestVerification(params),
          });
          reservation.status = "Guest";
          reservation.checkIn = params.checkIn;
          reservation.comments = params.comments;

          await reservation.save();
          // Enviarmos el correo con los 4 digitos de verificación
          codeVerification.CodeVerification(
            params.notifing,
            reservation.guest[0].verificationCode
          );
        } else {
          const dateConflict = await isDateConflict(
            params.checkIn,
            params.checkOut,
            params.condoId,
            params.areaId
          );

          if (dateConflict.length > 0) {
            return res.status(409).send({
              status: "error",
              message:
                "The reservation dates conflict with an existing reservation",
              conflictingReserves: dateConflict,
            });
          }

          reservation.condoId = params.condoId;
          reservation.apartmentUnit = params.unit;
          reservation.memberId = req.user.sub;
          reservation.bookingName = userInfo.name + " " + userInfo.lastname;
          reservation.phone = userInfo.phone;
          reservation.areaToReserve = params.areaId;
          reservation.checkIn = params.checkIn;
          reservation.checkOut = params.checkOut;
          reservation.visitorNumber = params.visitorNumber;
          await reservation.save();
        }
      } catch (errors) {
        console.error(errors);
        return res.status(500).send({
          status: "error",
          message: "Error creating reservation",
          error: errors,
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Reservation created successfully",
      });
    }
  },
  getAllBookingByCondoAndUnit: async function (req, res) {
    let id = req.body.id;

    let ownerFound = await Owner.find({
      createdBy: id,
    }).select("_id");

    try {
      // Ejecutar la consulta
      let reservations = await Reserves.find({
        $or: [
          { memberId: { $in: ownerFound.map((owner) => owner._id) } },
          { condoId: id },
          { memberId: id },
        ],
      })
        .populate({
          model: "Condominium",
          path: "condoId",
          select: "alias phone1 street_1 sector_name province city country",
        })
        .exec();

      if (reservations.length > 0) {
        return res.status(200).send({
          status: "success",
          message: reservations,
        });
      } else {
        return res.status(200).send({
          status: "error",
          message: "No reservations found",
        });
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      return res.status(500).send({
        status: "error",
        message: "Error fetching data",
      });
    }
  },

  updateReservation: async function (req, res) {
    let params = req.body;

    try {
      var book_var = await Reserves.findOne({ _id: params.id });

      if (!book_var) {
        return res.status(404).send({
          status: "error",
          message: "Reservation not found",
        });
      }

      if (book_var.status == "Expired") {
        return res.status(409).send({
          status: "error",
          message: "Reservation expired",
        });
      }

      if (Array.isArray(params?.guest) && params.guest.length > 0) {
        for (const element of params.guest) {
          try {
            if (Boolean(book_var.guest.find((x) => x._id == element._id))) {
              continue;
            } else {
              element.verificationCode = generateRandomCode();
              codeVerification.CodeVerification(
                element.notificationType,
                element.verificationCode
              );

              element.verificationCode = await bcrypt.hash(
                `${element.verificationCode}`,
                saltRounds
              );
              element.verify = false;
              element.guest_token = verifyGuest.guestVerification(element);
            }
          } catch (error) {
            console.error("Error hashing verification code:", error);
          }
        }
      }

      const bookingUpdated = await Reserves.findOneAndUpdate(
        { _id: params.id },
        params,
        { new: true }
      ).exec();

      return res.status(200).send({
        status: "success",
        message: bookingUpdated,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        status: "error",
        message: "Error updating reservation",
      });
    }
  },
  deleteReservation: function (req, res) {
    let deleteId = req.params.id;

    try {
      var id_delete = !validator.isEmpty(deleteId);
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Fill out all fields (required)",
      });
    }

    if (id_delete) {
      if (!["ROLE_ADMIN", "ROLE_STAFF"].includes(req.user.role)) {
        return res.status(403).send({
          status: "error",
          message: "Reservation could not be deleted, you are no authorized",
        });
      }

      Reserves.findOneAndDelete({ _id: deleteId }, (err, deleted) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Reservation could not be deleted",
          });
        }

        return res.status(200).send({
          status: "success",
          message: deleted,
        });
      });
    } else {
      return res.status(400).send({
        status: "error",
        message: "Fill out all fields (required)",
      });
    }
  },
};

module.exports = reservesController;

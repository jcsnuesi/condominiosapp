"use strict";

const Reserves = require("../models/reserves");
const Owner = require("../models/owners");
const Family = require("../models/family");
const Condominium = require("../models/condominio");
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
const { default: mongoose, mongo } = require("mongoose");
const { getTimeZoneDayBounds } = require("../service/timeZoneDayBounds");
const { canAccessDashboardIdentifier } = require("../service/dashboardScope");
const { canAccessCondominium } = require("../service/authorization");

const RESERVATION_DELETE_ROLES = new Set([
  "ADMIN",
  "STAFF_ADMIN",
  "ROLE_ADMIN",
  "ROLE_STAFF_ADMIN",
  "STAFF",
  "ROLE_STAFF",
]);

function canDeleteReservations(user) {
  return Boolean(user && RESERVATION_DELETE_ROLES.has(user.role));
}

async function getReservationDeleteScope(user) {
  if (user?.organizationId) {
    const scope = { organizationId: user.organizationId };
    if (user.scope?.mode === "SELECTED") {
      scope.condoId = { $in: user.scope.condominiumIds };
    }
    return scope;
  }
  const normalizedRole = String(user?.role || "").replace(/^ROLE_/, "");

  if (normalizedRole === "ADMIN") {
    const condominiumIds = await Condominium.distinct("_id", {
      createdBy: user.sub,
    });
    return { condoId: { $in: condominiumIds } };
  }

  if (normalizedRole === "STAFF_ADMIN" && user.createdBy) {
    const condominiumIds = await Condominium.distinct("_id", {
      createdBy: user.createdBy,
    });
    return { condoId: { $in: condominiumIds } };
  }

  if (normalizedRole === "STAFF") {
    const staff = await Staff.findById(user.sub).select("condo_id").lean();
    return staff?.condo_id ? { condoId: staff.condo_id } : null;
  }

  return null;
}

function eligibleReservationDeleteFilter(id, now = new Date(), scope = {}) {
  return {
    _id: id,
    ...scope,
    status: "Reserved",
    checkOut: { $lt: now },
  };
}

var reservesController = {
  createBooking: async function (req, res) {
    //Capturar los datos
    var params = req.body;
    var phoneNumber =
      params.phone && params.phone.length > 0 ? params.phone : "809-000-0000";

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
        const reservation = new Reserves();

        reservation.organizationId = req.auth.organizationId;
        reservation.memberId = req.user.sub;
        reservation.memberModel = params.memberModel;
        reservation.condoId = params.condoId;
        reservation.bookingName = Boolean(params.name)
          ? params?.name + " " + params?.lastname
          : params?.fullname;
        reservation.phone = phoneNumber;

        if (params.isguest) {
          reservation.guest.push({
            fullname: params.fullname,
            phone: phoneNumber,
            notificationType: params.notifyType?.label,
            verificationCode: generateRandomCode(),
            verify: false,
            guest_token: verifyGuest.guestVerification(params),
          });
        } else {
          reservation.checkOut = params.checkOut;
          reservation.areaToReserve = params.areaToReserve || params.areaId; // Phase 4 (major): align field usage — both keys supported per validateBooking
          reservation.visitorNumber = params.visitorNumber;
        }
        reservation.comments = params.comments;
        reservation.apartmentUnit = params.unit;
        reservation.checkIn = params.checkIn;
        reservation.status = params.isguest ? "Guest" : "Reserved";

        // Enviarmos el correo con los 4 digitos de verificación
        if (
          params.isguest &&
          params.notifyType?.label === "Email" &&
          reservation.guest[0]
        ) {
          codeVerification.CodeVerification(
            params.notifyType,
            reservation.guest[0].verificationCode
          );
        }

        if (!params.isguest) {
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
        }

        await reservation.save();
      } catch (errors) {
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
    try {
      let id = new mongoose.Types.ObjectId(req.params.id);
      const OwnerFound = await Owner.find({ createdBy: id })
        .select("_id")
        .exec();

      const filter = {
        $or: [
          { memberId: id },
          { memberId: { $in: OwnerFound.map((o) => o._id) } },
          { condoId: id },
        ],
      };
      if (req.auth) {
        filter.organizationId = req.auth.organizationId;
        if (req.auth.scope.mode === "SELECTED") {
          filter.condoId = { $in: req.auth.scope.condominiumIds };
        }
        if (["OWNER", "FAMILY"].includes(req.auth.role)) {
          if (String(id) !== String(req.user.sub) && !canAccessCondominium(req.auth, id)) {
            return res.status(403).send({ status: "forbidden", message: "You are not authorized to access these bookings" });
          }
          delete filter.$or;
          filter.memberId = req.user.sub;
        }
      }
      let reservations = await Reserves.find(filter)
        .populate({
          model: "Condominium",
          path: "condoId",
          select: "alias phone1 street_1 sector_name province city country",
        })
        .exec();

      return res.status(200).send({
        status: "success",
        message: reservations,
      });
    } catch (error) {
      console.error("Error fetching reservations:", error);
      return res.status(500).send({
        status: "error",
        message: "Error fetching data",
      });
    }
  },

  getBookingsCountByIdentifier: async function (req, res) {
    try {
      if (!req.auth && !canAccessDashboardIdentifier(req.user, req.params.id)) {
        return res.status(403).send({
          status: "forbidden",
          message: "You are not authorized to access these booking counts",
        });
      }

      const id = new mongoose.Types.ObjectId(req.params.id);
      if (req.auth) {
        const filter = { organizationId: req.auth.organizationId };
        if (req.auth.scope.mode === "SELECTED") {
          filter.condoId = { $in: req.auth.scope.condominiumIds };
        }
        const { start: startOfToday, end: startOfTomorrow } = getTimeZoneDayBounds();
        const [total, expiringToday] = await Promise.all([
          Reserves.countDocuments(filter),
          Reserves.countDocuments({ ...filter, status: { $ne: "Guest" }, checkOut: { $gte: startOfToday, $lt: startOfTomorrow } }),
        ]);
        return res.status(200).send({ success: true, data: { total, expiringToday }, error: null, code: "BOOKING_COUNTS_FETCHED" });
      }
      const ownerFound = await Owner.find({ createdBy: id })
        .select("_id")
        .lean();

      const filter = {
        $or: [
          { memberId: id },
          { condoId: id },
          { memberId: { $in: ownerFound.map((o) => o._id) } },
        ],
      };

      const { start: startOfToday, end: startOfTomorrow } =
        getTimeZoneDayBounds();

      const [total, expiringToday] = await Promise.all([
        Reserves.countDocuments(filter),
        Reserves.countDocuments({
          ...filter,
          status: { $ne: "Guest" },
          checkOut: {
            $gte: startOfToday,
            $lt: startOfTomorrow,
          },
        }),
      ]);

      return res.status(200).send({
        success: true,
        data: {
          total,
          expiringToday,
        },
        error: null,
        code: "BOOKING_COUNTS_FETCHED",
      });
    } catch (error) {
      console.error("Error fetching bookings count:", error);
      return res.status(500).send({
        status: "error",
        message: "Error fetching bookings count",
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
  deleteReservation: async function (req, res) {
    const deleteId = req.params.id;

    if (!canDeleteReservations(req.user)) {
      return res.status(403).send({
        status: "error",
        message: "You are not authorized to delete reservations",
      });
    }

    if (!mongoose.isValidObjectId(deleteId)) {
      return res.status(400).send({
        status: "error",
        message: "A valid reservation id is required",
      });
    }

    try {
      const scope = await getReservationDeleteScope(req.auth || req.user);
      if (!scope) {
        return res.status(403).send({
          status: "error",
          message: "No reservation deletion scope is assigned",
        });
      }

      // Keeping the business rules in the delete query prevents a status or date
      // change between validation and deletion from bypassing the restriction.
      const deleted = await Reserves.findOneAndDelete(
        eligibleReservationDeleteFilter(deleteId, new Date(), scope)
      );

      if (deleted) {
        return res.status(200).send({
          status: "success",
          message: deleted,
        });
      }

      const exists = await Reserves.exists({ _id: deleteId, ...scope });
      return res.status(exists ? 409 : 404).send({
        status: "error",
        code: exists ? "RESERVATION_NOT_DELETABLE" : "RESERVATION_NOT_FOUND",
        message: exists
          ? "Only Reserved reservations whose checkout has passed can be deleted"
          : "Reservation not found",
      });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      return res.status(500).send({
        status: "error",
        message: "Reservation could not be deleted",
      });
    }
  },

  deleteReservations: async function (req, res) {
    if (!canDeleteReservations(req.user)) {
      return res.status(403).send({
        status: "error",
        message: "You are not authorized to delete reservations",
      });
    }

    const ids = Array.isArray(req.body?.ids) ? [...new Set(req.body.ids)] : [];
    if (
      ids.length === 0 ||
      ids.length > 100 ||
      ids.some((id) => !mongoose.isValidObjectId(id))
    ) {
      return res.status(400).send({
        status: "error",
        message: "Between 1 and 100 valid reservation ids are required",
      });
    }

    try {
      const now = new Date();
      const scope = await getReservationDeleteScope(req.auth || req.user);
      if (!scope) {
        return res.status(403).send({
          status: "error",
          message: "No reservation deletion scope is assigned",
        });
      }

      const deletionResults = await Promise.all(
        ids.map(async (id) => ({
          id,
          deleted: await Reserves.findOneAndDelete(
            eligibleReservationDeleteFilter(id, now, scope)
          ),
        }))
      );
      const deletedIds = deletionResults
        .filter((result) => Boolean(result.deleted))
        .map((result) => result.id);
      const rejectedIds = deletionResults
        .filter((result) => !result.deleted)
        .map((result) => result.id);

      return res.status(200).send({
        status: "success",
        success: true,
        data: {
          requestedCount: ids.length,
          deletedCount: deletedIds.length,
          skippedCount: rejectedIds.length,
          deletedIds,
          rejectedIds,
        },
      });
    } catch (error) {
      console.error("Error deleting reservations:", error);
      return res.status(500).send({
        status: "error",
        message: "Reservations could not be deleted",
      });
    }
  },
};

module.exports = reservesController;
module.exports.canDeleteReservations = canDeleteReservations;
module.exports.getReservationDeleteScope = getReservationDeleteScope;
module.exports.eligibleReservationDeleteFilter =
  eligibleReservationDeleteFilter;

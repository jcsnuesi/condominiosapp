"use strict";

const mongoose = require("mongoose");
const apiResponse = require("../service/apiResponse");
const RentalChannel = require("../models/rentalChannel");
const ExternalReservation = require("../models/externalReservation");
const Notification = require("../models/notification");
const Condominium = require("../models/condominio");
const { syncChannel } = require("../service/icalSync");

function roleOf(req) {
  return String(req?.user?.role || "").toUpperCase();
}

function isAdminOrStaff(req) {
  const role = roleOf(req);
  return (
    role === "ADMIN" ||
    role === "STAFF" ||
    role === "STAFF_ADMIN" ||
    role === "ROLE_ADMIN" ||
    role === "ROLE_STAFF" ||
    role === "ROLE_STAFF_ADMIN"
  );
}

function toNotificationCreator(role) {
  const normalized = String(role || "").toUpperCase();
  if (normalized === "ADMIN" || normalized === "ROLE_ADMIN") {
    return { createdByModel: "Admin", createdByRole: "ADMIN" };
  }

  if (normalized === "STAFF_ADMIN" || normalized === "ROLE_STAFF_ADMIN") {
    return { createdByModel: "Staff_Admin", createdByRole: "STAFF_ADMIN" };
  }

  if (normalized === "STAFF" || normalized === "ROLE_STAFF") {
    return { createdByModel: "Staff", createdByRole: "STAFF" };
  }

  return null;
}

function buildPreRegistrationSuggestion(externalReservation, params) {
  return {
    guestFullname: String(
      params?.guestFullname ||
        externalReservation?.bookingName ||
        "Huesped externo"
    ).trim(),
    guestPhone: String(params?.guestPhone || "PENDIENTE").trim(),
    validFrom: externalReservation.checkIn,
    validUntil: externalReservation.checkOut,
    source: "external-reservation-conflict",
    status: "suggested",
  };
}

function asObjectId(value) {
  try {
    return new mongoose.Types.ObjectId(value);
  } catch (error) {
    return null;
  }
}

function condominiumScopeFilter(req) {
  const filter = { organizationId: req.auth?.organizationId };
  if (req.auth?.scope?.type === "SELECTED") {
    filter._id = { $in: req.auth.scope.condominiumIds || [] };
  }
  return filter;
}

const strController = {
  upsertRentalChannel: async function (req, res) {
    try {
      const params = req.body || {};

      if (!params.condoId || !params.calendarUrl || !params.channelType) {
        return apiResponse.failure(
          res,
          400,
          { message: "condoId, calendarUrl and channelType are required" },
          "VALIDATION_ERROR"
        );
      }

      const condoId = asObjectId(params.condoId);
      if (!condoId) {
        return apiResponse.failure(
          res,
          400,
          { message: "Invalid condoId" },
          "VALIDATION_ERROR"
        );
      }

      const condominium = await Condominium.findOne({
        ...condominiumScopeFilter(req),
        _id: condoId,
      }).select("_id");
      if (!condominium) {
        return apiResponse.failure(res, 403, { message: "Condominium is outside the active access scope" }, "CONDOMINIUM_SCOPE_DENIED");
      }

      const ownerId = isAdminOrStaff(req)
        ? asObjectId(params.ownerId || req.user.sub)
        : asObjectId(req.user.sub);

      if (!ownerId) {
        return apiResponse.failure(
          res,
          400,
          { message: "Invalid ownerId" },
          "VALIDATION_ERROR"
        );
      }

      const payload = {
        organizationId: req.auth.organizationId,
        condoId,
        ownerId,
        channelType: String(params.channelType).toUpperCase(),
        channelLabel: params.channelLabel || "",
        calendarUrl: String(params.calendarUrl).trim(),
        status: params.status || "active",
        syncFrequencyMinutes: params.syncFrequencyMinutes || 30,
        timezone: params.timezone || "America/Santo_Domingo",
        metadata: {
          ...(params.metadata || {}),
          apartmentUnit:
            params.apartmentUnit || params?.metadata?.apartmentUnit,
        },
      };

      const query = params.id
        ? { _id: asObjectId(params.id), ownerId, organizationId: req.auth.organizationId }
        : {
            organizationId: req.auth.organizationId,
            condoId,
            ownerId,
            calendarUrl: payload.calendarUrl,
          };

      const channel = await RentalChannel.findOneAndUpdate(query, payload, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });

      return apiResponse.success(res, 200, channel, "STR_CHANNEL_UPSERTED");
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        { message: "Failed to upsert rental channel", detail: error.message },
        "STR_CHANNEL_UPSERT_FAILED"
      );
    }
  },

  listRentalChannels: async function (req, res) {
    try {
      const filters = { organizationId: req.auth.organizationId };
      const query = req.query || {};

      if (query.condoId) {
        const condoId = asObjectId(query.condoId);
        if (!condoId) {
          return apiResponse.failure(
            res,
            400,
            { message: "Invalid condoId" },
            "VALIDATION_ERROR"
          );
        }
        filters.condoId = condoId;
        if (req.auth?.scope?.type === "SELECTED" && !req.auth.scope.condominiumIds.some((id) => String(id) === String(condoId))) {
          return apiResponse.failure(res, 403, { message: "Condominium is outside the active access scope" }, "CONDOMINIUM_SCOPE_DENIED");
        }
      }

      if (query.status) {
        filters.status = query.status;
      }

      if (req.auth?.scope?.type === "SELECTED" && !filters.condoId) {
        filters.condoId = { $in: req.auth.scope.condominiumIds || [] };
      }

      if (isAdminOrStaff(req)) {
        if (query.ownerId) {
          const ownerId = asObjectId(query.ownerId);
          if (!ownerId) {
            return apiResponse.failure(
              res,
              400,
              { message: "Invalid ownerId" },
              "VALIDATION_ERROR"
            );
          }
          filters.ownerId = ownerId;
        }
      } else {
        const ownerId = asObjectId(req.user.sub);
        if (!ownerId) {
          return apiResponse.failure(
            res,
            400,
            { message: "Invalid ownerId" },
            "VALIDATION_ERROR"
          );
        }
        filters.ownerId = ownerId;
      }

      const channels = await RentalChannel.find(filters)
        .sort({ createdAt: -1 })
        .lean();

      return apiResponse.success(res, 200, channels, "STR_CHANNELS_LISTED");
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        { message: "Failed to list rental channels", detail: error.message },
        "STR_CHANNELS_LIST_FAILED"
      );
    }
  },

  updateRentalChannelStatus: async function (req, res) {
    try {
      const id = asObjectId(req.params.id);
      const status = req.body?.status;

      if (!id || !status) {
        return apiResponse.failure(
          res,
          400,
          { message: "id and status are required" },
          "VALIDATION_ERROR"
        );
      }

      const query = { _id: id, organizationId: req.auth.organizationId };
      if (req.auth?.scope?.type === "SELECTED") query.condoId = { $in: req.auth.scope.condominiumIds || [] };
      if (!isAdminOrStaff(req)) {
        query.ownerId = asObjectId(req.user.sub);
      }

      const updated = await RentalChannel.findOneAndUpdate(
        query,
        { status },
        { new: true }
      );

      if (!updated) {
        return apiResponse.failure(
          res,
          404,
          { message: "Rental channel not found" },
          "STR_CHANNEL_NOT_FOUND"
        );
      }

      return apiResponse.success(
        res,
        200,
        updated,
        "STR_CHANNEL_STATUS_UPDATED"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        {
          message: "Failed to update rental channel status",
          detail: error.message,
        },
        "STR_CHANNEL_STATUS_UPDATE_FAILED"
      );
    }
  },

  syncRentalChannel: async function (req, res) {
    try {
      const id = asObjectId(req.params.id);
      if (!id) {
        return apiResponse.failure(
          res,
          400,
          { message: "Valid rental channel id is required" },
          "VALIDATION_ERROR"
        );
      }

      const query = { _id: id, organizationId: req.auth.organizationId };
      if (req.auth?.scope?.type === "SELECTED") query.condoId = { $in: req.auth.scope.condominiumIds || [] };
      if (!isAdminOrStaff(req)) {
        query.ownerId = asObjectId(req.user.sub);
      }

      const channel = await RentalChannel.findOne(query);
      if (!channel) {
        return apiResponse.failure(
          res,
          404,
          { message: "Rental channel not found" },
          "STR_CHANNEL_NOT_FOUND"
        );
      }

      const result = await syncChannel(channel);
      return apiResponse.success(res, 200, result, "STR_CHANNEL_SYNCED");
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        { message: "Failed to sync rental channel", detail: error.message },
        "STR_CHANNEL_SYNC_FAILED"
      );
    }
  },

  listExternalReservations: async function (req, res) {
    try {
      const condoId = asObjectId(req.params.condoId || req.query.condoId);
      if (!condoId) {
        return apiResponse.failure(
          res,
          400,
          { message: "Valid condoId is required" },
          "VALIDATION_ERROR"
        );
      }

      const filters = { condoId, organizationId: req.auth.organizationId };
      if (req.query?.apartmentUnit) {
        filters.apartmentUnit = req.query.apartmentUnit;
      }

      if (req.auth?.scope?.type === "SELECTED" && !req.auth.scope.condominiumIds.some((id) => String(id) === String(condoId))) {
        return apiResponse.failure(res, 403, { message: "Condominium is outside the active access scope" }, "CONDOMINIUM_SCOPE_DENIED");
      }

      const reservations = await ExternalReservation.find(filters)
        .sort({ checkIn: 1 })
        .populate({
          path: "rentalChannelId",
          select: "channelType channelLabel ownerId status",
        })
        .lean();

      return apiResponse.success(
        res,
        200,
        {
          total: reservations.length,
          docs: reservations,
        },
        "STR_EXTERNAL_RESERVATIONS_LISTED"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        {
          message: "Failed to list external reservations",
          detail: error.message,
        },
        "STR_EXTERNAL_RESERVATIONS_LIST_FAILED"
      );
    }
  },

  listExternalConflicts: async function (req, res) {
    try {
      const condoId = asObjectId(req.params.condoId || req.query.condoId);
      if (!condoId) {
        return apiResponse.failure(
          res,
          400,
          { message: "Valid condoId is required" },
          "VALIDATION_ERROR"
        );
      }

      const filters = {
        organizationId: req.auth.organizationId,
        condoId,
        conflictStatus: { $in: ["potential", "confirmed"] },
      };

      if (req.query?.apartmentUnit) {
        filters.apartmentUnit = req.query.apartmentUnit;
      }

      if (req.auth?.scope?.type === "SELECTED" && !req.auth.scope.condominiumIds.some((id) => String(id) === String(condoId))) {
        return apiResponse.failure(res, 403, { message: "Condominium is outside the active access scope" }, "CONDOMINIUM_SCOPE_DENIED");
      }

      const conflicts = await ExternalReservation.find(filters)
        .sort({ checkIn: 1 })
        .populate({
          path: "rentalChannelId",
          select: "channelType channelLabel ownerId status",
        })
        .lean();

      return apiResponse.success(
        res,
        200,
        {
          total: conflicts.length,
          docs: conflicts,
        },
        "STR_CONFLICTS_LISTED"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        { message: "Failed to list conflicts", detail: error.message },
        "STR_CONFLICT_LIST_FAILED"
      );
    }
  },

  createConflictPreregistrationAlert: async function (req, res) {
    try {
      if (!isAdminOrStaff(req)) {
        return apiResponse.failure(
          res,
          403,
          {
            message: "Only admin/security roles can create STR conflict alerts",
          },
          "FORBIDDEN"
        );
      }

      const reservationId = asObjectId(req.params.id);
      if (!reservationId) {
        return apiResponse.failure(
          res,
          400,
          { message: "Valid external reservation id is required" },
          "VALIDATION_ERROR"
        );
      }

      const externalReservation = await ExternalReservation.findOne({
        _id: reservationId,
        organizationId: req.auth.organizationId,
        ...(req.auth?.scope?.type === "SELECTED" ? { condoId: { $in: req.auth.scope.condominiumIds || [] } } : {}),
      });
      if (!externalReservation) {
        return apiResponse.failure(
          res,
          404,
          { message: "External reservation not found" },
          "STR_EXTERNAL_RESERVATION_NOT_FOUND"
        );
      }

      if (externalReservation.conflictStatus === "none") {
        return apiResponse.failure(
          res,
          409,
          { message: "Reservation has no active conflict to escalate" },
          "STR_CONFLICT_NOT_ACTIVE"
        );
      }

      const creator = toNotificationCreator(req.user?.role);
      const createdBy = asObjectId(req.user?.sub);
      if (!creator || !createdBy) {
        return apiResponse.failure(
          res,
          400,
          {
            message: "Invalid user context for alert creation",
          },
          "VALIDATION_ERROR"
        );
      }

      const suggestion = buildPreRegistrationSuggestion(
        externalReservation,
        req.body || {}
      );

      const conflictWindow = `${externalReservation.checkIn.toISOString()} - ${externalReservation.checkOut.toISOString()}`;
      const newNotification = await Notification.create({
        organizationId: req.auth.organizationId,
        title: `Conflicto STR detectado en unidad ${externalReservation.apartmentUnit}`,
        content:
          `Se detecto un conflicto entre reserva externa e interna para la unidad ${externalReservation.apartmentUnit}. ` +
          `Rango: ${conflictWindow}. ` +
          `Se sugiere preregistro para ${suggestion.guestFullname}.`,
        type: "security",
        priority: "high",
        condominiumId: externalReservation.condoId,
        targetAudience: "units",
        targetUnits: [externalReservation.apartmentUnit],
        createdBy,
        createdByModel: creator.createdByModel,
        createdByRole: creator.createdByRole,
      });

      externalReservation.conflictStatus = "confirmed";
      externalReservation.rawPayload = {
        ...(externalReservation.rawPayload || {}),
        operationalAlert: {
          notificationId: newNotification._id,
          createdAt: new Date(),
          createdBy,
        },
        preRegistrationSuggestion: suggestion,
      };
      await externalReservation.save();

      return apiResponse.success(
        res,
        201,
        {
          externalReservationId: externalReservation._id,
          conflictStatus: externalReservation.conflictStatus,
          notificationId: newNotification._id,
          preRegistrationSuggestion: suggestion,
        },
        "STR_CONFLICT_ALERT_CREATED"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        {
          message: "Failed to create STR conflict alert",
          detail: error.message,
        },
        "STR_CONFLICT_ALERT_CREATE_FAILED"
      );
    }
  },
};

strController._helpers = {
  toNotificationCreator,
  buildPreRegistrationSuggestion,
};

module.exports = strController;

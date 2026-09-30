const express = require("express");
const Inquiry = require("../models/inquiry");
const mongoose = require("mongoose");
const multer = require("multer");
const router = express.Router();
const fs = require("fs");
var md_auth = require("../middleware/auth");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/inquiries/"); // <-- carpeta de destino
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // <-- obtiene la extension .pdf
    cb(null, uniqueName + ext); // <-- agrega la extension
  },
});
const storageNotification = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/notifications/"); // <-- carpeta de destino
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // <-- obtiene la extension .pdf
    cb(null, uniqueName + ext); // <-- agrega la extension
  },
});
const Condominium = require("../models/condominio");
const Owner = require("../models/owners");
const { isOwnerPropertyActive } = require("../service/residentPropertyAccess");
const Notification = require("../models/notification");
const {
  filenameValidation,
  validateRequest,
} = require("../middleware/requestValidation");
const {
  canAccessNotification,
  findAccessibleNotificationAttachment,
  resolveSafeNotificationPath,
} = require("../service/notificationFileAccess");
const apiResponse = require("../service/apiResponse");
const {
  buildInquiryFilter,
  buildNotificationFilter,
  boundedPagination,
  canAccessCondominium,
  canAccessInquiry,
  canUseUnitInCondominium,
  isAdminRole,
  isResidentRole,
  isValidObjectId,
  getResidentUnits,
  getAccessibleCondominiumIds,
  isAggregateIdentifierForUser,
  normalizeRole,
  resolveRequestedCondominiumIds,
  roleToModel,
} = require("../service/inquiryAccess");

const allowedUploadExtensions = /\.(jpg|jpeg|png|gif|webp|pdf|txt|doc|docx)$/i;
const allowedUploadMimeTypes = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf",
  "text/plain", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const uploadOptions = {
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
  fileFilter(req, file, callback) {
    const accepted =
      allowedUploadExtensions.test(file.originalname) &&
      allowedUploadMimeTypes.has(file.mimetype);
    callback(accepted ? null : new Error("Unsupported attachment type"), accepted);
  },
};
const requireAdminRole = (req, res, next) =>
  isAdminRole(req.user?.role)
    ? next()
    : apiResponse.failure(res, 403, { message: "Administrator role required" }, "INQUIRY_FORBIDDEN");
const invalidId = (res, label = "identifier") =>
  apiResponse.failure(res, 400, { message: `Invalid ${label}` }, "INQUIRY_INVALID_ID");
const forbidden = (res) =>
  apiResponse.failure(res, 403, { message: "Access denied" }, "INQUIRY_FORBIDDEN");
const requireInquiryManagerAccess = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return invalidId(res, "inquiry ID");
    const inquiry = await Inquiry.findById(req.params.id).select("organizationId condominiumId createdBy").lean();
    if (!inquiry) return apiResponse.failure(res, 404, { message: "Inquiry not found" }, "INQUIRY_NOTIFICATION_NOT_FOUND");
    if (!(await canAccessInquiry(req.user, inquiry))) return forbidden(res);
    req.scopedInquiry = inquiry;
    next();
  } catch (error) {
    next(error);
  }
};
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const cleanupUploadedFiles = (files = []) =>
  Promise.all(files.map((file) => fs.promises.unlink(file.path).catch(() => undefined)));
const upload = multer({ storage, ...uploadOptions });
const uploadNotification = multer({ storage: storageNotification, ...uploadOptions });

// GET /API/notification-by-condominium
router.get(
  "/notification-by-condominium/:condominiumId",
  md_auth.authenticated,
  async (req, res) => {
    try {
      const condominiumIds = await resolveRequestedCondominiumIds(
        req.user,
        req.params.condominiumId
      );
      if (condominiumIds === null) return invalidId(res, "condominium ID");
      if (
        !condominiumIds.length &&
        !isAggregateIdentifierForUser(req.user, req.params.condominiumId)
      ) {
        return forbidden(res);
      }
      const query = await buildNotificationFilter(req.user, condominiumIds);

      const notifications = await Notification.find(query)
        .populate("createdBy", "name lastname email")
        .populate("condominiumId", "name address")
        .sort({ publishedAt: -1 });

      return apiResponse.success(
        res,
        200,
        notifications,
        "INQUIRY_NOTIFICATION_BY_CONDO_OK"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        { message: error.message },
        "INQUIRY_NOTIFICATION_BY_CONDO_FAILED"
      );
    }
  }
);

// GET /api/notifications - Get all notifications with pagination and filters
router.get("/get-notifications", md_auth.authenticated, requireAdminRole, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      condominiumId,
      type,
      priority,
      isActive,
      role,
    } = req.query;

    const accessibleIds = await getAccessibleCondominiumIds(req.user);
    const filter = { condominiumId: { $in: accessibleIds } };

    if (condominiumId) {
      if (!isValidObjectId(condominiumId)) return invalidId(res, "condominium ID");
      if (!accessibleIds.includes(String(condominiumId))) return forbidden(res);
      filter.condominiumId = condominiumId;
    }
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (role) filter.role = role;

    const pagination = boundedPagination(page, limit);
    const options = {
      ...pagination,
      sort: { publishedAt: -1 },
      populate: [
        { path: "condominiumId", select: "name" },
        { path: "createdBy" },
        { path: "responseBy" },
      ],
    };

    const notifications = await Inquiry.paginate(filter, options);
    return apiResponse.success(
      res,
      200,
      notifications,
      "INQUIRY_GET_NOTIFICATIONS_OK"
    );
  } catch (error) {
    return apiResponse.failure(
      res,
      500,
      { message: error.message },
      "INQUIRY_GET_NOTIFICATIONS_FAILED"
    );
  }
});

// GET /api/notifications/:id - Get notification by ID
router.get("/get-notifications-by-id/:id", md_auth.authenticated, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return invalidId(res, "inquiry ID");
    const notification = await Inquiry.findById(req.params.id)
      .populate("condominiumId", "name")
      .populate("createdBy")
      .populate({
        path: "responses",
        populate: { path: "respondedBy" },
      });

    if (!notification) {
      return apiResponse.failure(
        res,
        404,
        { message: "Notification not found" },
        "INQUIRY_NOTIFICATION_NOT_FOUND"
      );
    }
    if (!(await canAccessInquiry(req.user, notification))) return forbidden(res);

    return apiResponse.success(
      res,
      200,
      notification,
      "INQUIRY_GET_NOTIFICATION_BY_ID_OK"
    );
  } catch (error) {
    return apiResponse.failure(
      res,
      500,
      { message: error.message },
      "INQUIRY_GET_NOTIFICATION_BY_ID_FAILED"
    );
  }
});

// GET inquiries created for a specific owner. This route must be declared
// before /inquiries/:condominiumId so the owner-specific path is not consumed
// by the generic identifier route.
router.get(
  "/inquiries-by-owner/:ownerId",
  md_auth.authenticated,
  async (req, res) => {
    try {
      const ownerId = req.params.ownerId;
      const role = normalizeRole(req.user.role);

      if (!isValidObjectId(ownerId)) return invalidId(res, "owner ID");
      if (!isAdminRole(role) && String(req.user.sub) !== String(ownerId)) {
        return forbidden(res);
      }

      const owner = await Owner.findOne({
        _id: ownerId,
        organizationId: req.auth.organizationId,
      })
        .select("propertyDetails.addressId")
        .lean();

      if (!owner) {
        return apiResponse.failure(
          res,
          404,
          { message: "Owner not found" },
          "INQUIRY_OWNER_NOT_FOUND"
        );
      }

      const accessibleIds = await getAccessibleCondominiumIds(req.user);
      const ownerCondominiumIds = (owner.propertyDetails || [])
        .map((property) => String(property.addressId || ""))
        .filter((id) => accessibleIds.includes(id));

      const filter = {
        organizationId: req.auth.organizationId,
        createdBy: new mongoose.Types.ObjectId(ownerId),
        createdInquiryBy: "Owner",
        condominiumId: { $in: ownerCondominiumIds },
        isActive: true,
      };

      if (req.query.status && req.query.status !== "all") {
        if (!["sent", "responded", "closed"].includes(req.query.status)) {
          return apiResponse.failure(
            res,
            400,
            { message: "Invalid status" },
            "INQUIRY_INVALID_STATUS"
          );
        }
        filter.status = req.query.status;
      }

      const pagination = boundedPagination(req.query.page, req.query.limit);
      const inquiries = await Inquiry.paginate(filter, {
        ...pagination,
        sort: { publishedAt: -1 },
        populate: [
          { path: "responses.respondedBy", select: "name lastname email role" },
          { path: "condominiumId", select: "alias" },
          { path: "createdBy", select: "name lastname email" },
        ],
      });

      return apiResponse.success(
        res,
        200,
        inquiries,
        "INQUIRY_LIST_BY_OWNER_OK"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        { message: error.message },
        "INQUIRY_LIST_BY_OWNER_FAILED"
      );
    }
  }
);

//✅ GET /api/notifications/condominium/:condominiumId - Get notifications by condominium
router.get(
  "/inquiries/:condominiumId",
  md_auth.authenticated,
  async (req, res) => {
    try {
      const role = normalizeRole(req.user.role);
      if (!role) {
        return apiResponse.failure(
          res,
          400,
          { message: "Role is required" },
          "INQUIRY_ROLE_REQUIRED"
        );
      }

      const scoped = await buildInquiryFilter(req.user, req.params.condominiumId);
      if (scoped.error === "invalid-id") return invalidId(res, "identifier");
      if (scoped.error) return forbidden(res);
      const filter = scoped.filter;

      const { page, limit } = boundedPagination(req.query.page, req.query.limit);
      if (req.query.status && req.query.status !== "all") {
        if (!["sent", "responded", "closed"].includes(req.query.status)) {
          return apiResponse.failure(res, 400, { message: "Invalid status" }, "INQUIRY_INVALID_STATUS");
        }
        filter.status = req.query.status;
      }

      const options = {
        page,
        limit,
        sort: { publishedAt: -1 },
        populate: [
          { path: "responses.respondedBy", select: "name lastname email role" },
          { path: "condominiumId", select: "alias" },
          { path: "createdBy", select: "name lastname email" },
        ],
      };

      const [inquiry, responded] = await Promise.all([
        Inquiry.paginate(filter, options),
        Inquiry.countDocuments({
          ...filter,
          status: "responded",
        }),
      ]);

      return apiResponse.success(
        res,
        200,
        {
          ...inquiry,
          responded,
        },
        "INQUIRY_LIST_BY_CONDO_OK"
      );
    } catch (error) {
      console.log("error:", error);
      return apiResponse.failure(
        res,
        500,
        { message: error.message },
        "INQUIRY_LIST_BY_CONDO_FAILED"
      );
    }
  }
);

// ✅ GET get-usersby/condominiums/:condominiumId - Get users by condominium ID
router.get(
  "/get-usersby/condominiums/:condominiumId",
  md_auth.authenticated,
  async (req, res) => {
    try {
      var condominiumId = req.params.condominiumId;
      var role = normalizeRole(req.user.role);

      if (role != "ADMIN" && role != "STAFF_ADMIN" && role != "STAFF") {
        return apiResponse.failure(
          res,
          403,
          { message: "Admins users only" },
          "INQUIRY_ADMIN_ONLY"
        );
      }
      if (!isValidObjectId(condominiumId)) return invalidId(res, "condominium ID");
      if (!(await canAccessCondominium(req.user, condominiumId))) return forbidden(res);

      const users = await Condominium.findOne({ _id: condominiumId })
        .populate({
          path: "units_ownerId",
          model: "Owner",
          select: "name lastname email phone role",
          populate: {
            path: "familyAccount",
            select: "name lastname email phone",
            model: "Family", // opcional si está definido en el schema
          },
        })
        .exec();
      console.log("users:", users);

      if (!users) {
        return apiResponse.failure(
          res,
          404,
          { message: "Condominium not found" },
          "INQUIRY_CONDOMINIUM_NOT_FOUND"
        );
      }
      return apiResponse.success(
        res,
        200,
        users,
        "INQUIRY_GET_USERS_BY_CONDO_OK"
      );
    } catch (error) {
      console.log("error:------>", error);
      return apiResponse.failure(
        res,
        500,
        { message: error.message },
        "INQUIRY_GET_USERS_BY_CONDO_FAILED"
      );
    }
  }
);

// GET /api/notifications/stats/:condominiumId - Get notification statistics
router.get("/stats/:condominiumId", md_auth.authenticated, requireAdminRole, async (req, res) => {
  try {
    const condominiumId = req.params.condominiumId;
    if (!isValidObjectId(condominiumId)) return invalidId(res, "condominium ID");
    if (!(await canAccessCondominium(req.user, condominiumId))) return forbidden(res);

    const stats = await Inquiry.aggregate([
      { $match: { condominiumId: new mongoose.Types.ObjectId(condominiumId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] } },
          byType: { $push: "$type" },
          byPriority: { $push: "$priority" },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          active: 1,
          inactive: { $subtract: ["$total", "$active"] },
          typeStats: {
            $arrayToObject: {
              $map: {
                input: {
                  $setUnion: ["$byType"],
                },
                as: "type",
                in: {
                  k: "$$type",
                  v: {
                    $size: {
                      $filter: {
                        input: "$byType",
                        cond: { $eq: ["$$this", "$$type"] },
                      },
                    },
                  },
                },
              },
            },
          },
          priorityStats: {
            $arrayToObject: {
              $map: {
                input: {
                  $setUnion: ["$byPriority"],
                },
                as: "priority",
                in: {
                  k: "$$priority",
                  v: {
                    $size: {
                      $filter: {
                        input: "$byPriority",
                        cond: { $eq: ["$$this", "$$priority"] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    const result = stats[0] || {
      total: 0,
      active: 0,
      inactive: 0,
      typeStats: {},
      priorityStats: {},
    };

    return apiResponse.success(res, 200, result, "INQUIRY_STATS_OK");
  } catch (error) {
    return apiResponse.failure(
      res,
      500,
      { message: error.message },
      "INQUIRY_STATS_FAILED"
    );
  }
});
// POST /api/notifications - Create new notification
//

// PUT /api/notifications/:id - Update notification
router.put(
  "/update-notification/:id",
  md_auth.authenticated,
  requireAdminRole,
  requireInquiryManagerAccess,
  upload.single("attachment"),
  async (req, res) => {
    try {
      const {
        title,
        content,
        type,
        priority,
        attachments,
        expiresAt,
        isActive,
        responseByModel,
        message,
        respondedBy,
        respondedByModel,
        respondedByRole,
      } = req.body;

      const notification = await Inquiry.findByIdAndUpdate(
        req.params.id,
        {
          title,
          content,
          type,
          priority,
          attachments,
          expiresAt,
          isActive,
          responseByModel,
          $push: {
            responses: {
              message,
              respondedBy,
              respondedByModel,
              respondedByRole,
              respondedAt: new Date(),
            },
          },
        },
        { new: true, runValidators: true }
      )
        .populate("condominiumId", "name")
        .populate("createdBy")
        .populate({
          path: "responses.respondedBy",
          model: respondedByModel,
          select: "name lastname gender role email phone position",
        });

      if (!notification) {
        return apiResponse.failure(
          res,
          404,
          { message: "Notification not found" },
          "INQUIRY_UPDATE_NOTIFICATION_NOT_FOUND"
        );
      }

      return apiResponse.success(
        res,
        200,
        notification,
        "INQUIRY_UPDATE_NOTIFICATION_OK"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        400,
        { message: error.message },
        "INQUIRY_UPDATE_NOTIFICATION_FAILED"
      );
    }
  }
);

// DELETE /api/notifications/:id - Delete notification
router.delete("/delete-notification/:id", md_auth.authenticated, requireAdminRole, requireInquiryManagerAccess, async (req, res) => {
  try {
    const notification = await Inquiry.findByIdAndDelete(req.params.id);

    if (!notification) {
      return apiResponse.failure(
        res,
        404,
        { message: "Notification not found" },
        "INQUIRY_DELETE_NOTIFICATION_NOT_FOUND"
      );
    }

    return apiResponse.success(
      res,
      200,
      { message: "Notification deleted successfully" },
      "INQUIRY_DELETE_NOTIFICATION_OK"
    );
  } catch (error) {
    return apiResponse.failure(
      res,
      500,
      { message: error.message },
      "INQUIRY_DELETE_NOTIFICATION_FAILED"
    );
  }
});

// PATCH Api/notices-read/:id - Mark notice as read
router.put("/notices-read/:id", md_auth.authenticated, async (req, res) => {
  try {
    const noticeId = req.params.id;
    if (!isValidObjectId(noticeId)) return invalidId(res, "notification ID");
    const notice = await Notification.findById(noticeId);

    if (!notice) {
      return apiResponse.failure(
        res,
        404,
        { message: "Notice not found" },
        "INQUIRY_NOTICE_NOT_FOUND"
      );
    }
    if (!(await canAccessCondominium(req.user, notice.condominiumId))) return forbidden(res);
    const units = await getResidentUnits(req.user);
    if (!canAccessNotification(notice, req.user, units)) return forbidden(res);
    await notice.markAsRead(req.user.sub, roleToModel(req.user.role));
    return apiResponse.success(
      res,
      200,
      {
        message: "Notice marked as read",
        notice,
      },
      "INQUIRY_NOTICE_MARKED_READ"
    );
  } catch (error) {
    console.log("error:", error);

    return apiResponse.failure(
      res,
      500,
      { message: error.message },
      "INQUIRY_NOTICE_MARK_READ_FAILED"
    );
  }
});

router.put("/delete-attachment", md_auth.authenticated, requireAdminRole, async (req, res) => {
  try {
    const notificationId = req.body?.noticeId;
    const fileName = String(req.body?.filename || "");
    if (!isValidObjectId(notificationId)) return invalidId(res, "notification ID");
    if (!fileName || path.basename(fileName) !== fileName) return invalidId(res, "filename");

    const notification = await Notification.findOne({
      _id: notificationId,
      isDeleted: false,
      "attachments.storedFilename": fileName,
    }).select("condominiumId attachments");
    if (!notification) {
      return apiResponse.failure(res, 404, { message: "Attachment not found" }, "INQUIRY_ATTACHMENT_NOT_FOUND");
    }
    if (!(await canAccessCondominium(req.user, notification.condominiumId))) return forbidden(res);

    const updated = await Notification.updateOne(
      { _id: notificationId, "attachments.storedFilename": fileName },
      { $pull: { attachments: { storedFilename: fileName } } }
    );
    if (updated.modifiedCount !== 1) {
      return apiResponse.failure(res, 409, { message: "Attachment changed concurrently" }, "INQUIRY_ATTACHMENT_CONFLICT");
    }

    const filePath = resolveSafeNotificationPath(
      path.join(__dirname, "../uploads/notifications/"),
      fileName
    );
    if (filePath) {
      await fs.promises.unlink(filePath).catch((error) => {
        if (error.code !== "ENOENT") console.error("Failed to remove orphaned attachment file:", error);
      });
    }
    return apiResponse.success(
      res,
      200,
      { message: "Attachment deleted successfully" },
      "INQUIRY_DELETE_ATTACHMENT_OK"
    );
  } catch (error) {
    console.error("Error deleting attachment:", error);
    return apiResponse.failure(
      res,
      500,
      { message: error.message },
      "INQUIRY_DELETE_ATTACHMENT_FAILED"
    );
  }
});

router.put(
  "/update-notices",
  md_auth.authenticated,
  requireAdminRole,
  uploadNotification.array("attachments", 5),
  async (req, res) => {
    var params = req.body;

    try {
      // Validations

      if (Boolean(req.body.specificRecipients)) {
        const specificRecipients = Array.isArray(req.body.specificRecipients)
          ? req.body.specificRecipients.find((v) => v != null)
          : req.body.specificRecipients;

        params.specificRecipients = Array.isArray(specificRecipients)
          ? specificRecipients
          : [specificRecipients];

        params.specificRecipientModel = Array.isArray(
          req.body.specificRecipientModel
        )
          ? [...new Set(req.body.specificRecipientModel)][0]
          : req.body.specificRecipientModel;
      }

      // Validations
      if (
        !params.title ||
        !params.content ||
        !params.type ||
        !params.condominiumId
      ) {
        return apiResponse.failure(
          res,
          400,
          {
            message:
              "Missing required fields: title, content, type, condominiumId",
          },
          "INQUIRY_UPDATE_NOTICES_VALIDATION_ERROR"
        );
      }
      if (!isValidObjectId(params._id)) return invalidId(res, "notification ID");
      const existingNotification = await Notification.findById(params._id)
        .select("condominiumId attachments isDeleted")
        .lean();
      if (!existingNotification || existingNotification.isDeleted) {
        return apiResponse.failure(res, 404, { message: "Notification not found" }, "INQUIRY_NOTIFICATION_NOT_FOUND");
      }
      if (!(await canAccessCondominium(req.user, existingNotification.condominiumId))) {
        return forbidden(res);
      }

      // Update notification
      const filteredParams = {};

      const allowedUpdateFields = new Set([
        "title", "content", "type", "priority", "targetAudience",
        "specificRecipients", "specificRecipientModel", "targetUnits",
        "expiresAt", "isActive", "settings", "metadata",
      ]);
      for (const key of Object.keys(params)) {
        if (allowedUpdateFields.has(key) && params[key] !== undefined) {
          filteredParams[key] = params[key];
        }
      }
      // Process attachments
      const attachments = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          attachments.push({
            filename: file.originalname,
            storedFilename: file.filename,
            url: `/uploads/notifications/${file.filename}`,
            mimetype: file.mimetype,
            size: file.size,
          });
        });

        filteredParams.attachments = [
          ...(existingNotification.attachments || []),
          ...attachments,
        ];
      }
      filteredParams.lastUpdatedBy = req.user.sub;
      filteredParams.lastUpdatedByModel = roleToModel(req.user.role);
      const updateNotification = await Notification.findOneAndUpdate(
        { _id: params._id, condominiumId: existingNotification.condominiumId, isDeleted: false },
        filteredParams,
        { new: true, runValidators: true }
      );

      if (!updateNotification) {
        throw new Error("Notification not found");
      }

      return apiResponse.success(
        res,
        200,
        {
          message: "Notification updated successfully",
          notification: updateNotification,
        },
        "INQUIRY_UPDATE_NOTICES_OK"
      );
    } catch (error) {
      console.error("Error updating notification:", error);

      // Delete uploaded files on error
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        });
      }

      return apiResponse.failure(
        res,
        500,
        { message: error.message || "Failed to create notification" },
        "INQUIRY_UPDATE_NOTICES_FAILED"
      );
    }
  }
);

// PATCH /api/notifications/:id/deactivate - Deactivate notification
router.patch("/deactivate-notification/:id", md_auth.authenticated, requireAdminRole, requireInquiryManagerAccess, async (req, res) => {
  try {
    const notification = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!notification) {
      return apiResponse.failure(
        res,
        404,
        { message: "Notification not found" },
        "INQUIRY_DEACTIVATE_NOT_FOUND"
      );
    }

    return apiResponse.success(res, 200, notification, "INQUIRY_DEACTIVATE_OK");
  } catch (error) {
    return apiResponse.failure(
      res,
      500,
      { message: error.message },
      "INQUIRY_DEACTIVATE_FAILED"
    );
  }
});

// PATCH /api/notifications/:id/activate - Activate notification
router.patch("/activate-notification/:id", md_auth.authenticated, requireAdminRole, requireInquiryManagerAccess, async (req, res) => {
  try {
    const notification = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!notification) {
      return apiResponse.failure(
        res,
        404,
        { message: "Notification not found" },
        "INQUIRY_ACTIVATE_NOT_FOUND"
      );
    }

    return apiResponse.success(res, 200, notification, "INQUIRY_ACTIVATE_OK");
  } catch (error) {
    return apiResponse.failure(
      res,
      500,
      { message: error.message },
      "INQUIRY_ACTIVATE_FAILED"
    );
  }
});

// POST /api/notifications/inquiries/response - Add response to inquiry
router.post("/inquiries/response", md_auth.authenticated, async (req, res) => {
  try {
    const {
      inquiryId,
      message,
      status,
    } = req.body;
    const respondedBy = req.user.sub;
    const respondedByRole = normalizeRole(req.user.role);
    const respondedByModel = roleToModel(respondedByRole);

    // Validar campos requeridos
    if (
      !inquiryId ||
      !message ||
      !respondedBy ||
      !respondedByRole
    ) {
      return apiResponse.failure(
        res,
        400,
        {
          message:
            "Missing required fields: inquiryId, message, respondedBy, respondedByModel",
        },
        "INQUIRY_RESPONSE_VALIDATION_ERROR"
      );
    }
    if (!isValidObjectId(inquiryId)) return invalidId(res, "inquiry ID");
    if (typeof message !== "string" || !message.trim() || message.trim().length > 2000) {
      return apiResponse.failure(res, 400, { message: "Response message must contain 1 to 2000 characters" }, "INQUIRY_RESPONSE_VALIDATION_ERROR");
    }
    if (!["responded", "closed"].includes(status)) {
      return apiResponse.failure(res, 400, { message: "Invalid inquiry status transition" }, "INQUIRY_INVALID_STATUS");
    }

    // Validar que el inquiry existe
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return apiResponse.failure(
        res,
        404,
        { message: "Inquiry not found" },
        "INQUIRY_RESPONSE_TARGET_NOT_FOUND"
      );
    }
    if (!(await canAccessInquiry(req.user, inquiry))) return forbidden(res);

    // Map role to correct Mongoose model for refPath
    const normalizedModel = respondedByModel;

    if (!normalizedModel) {
      return apiResponse.failure(
        res,
        400,
        { message: "Invalid respondedByModel for the provided role" },
        "INQUIRY_RESPONSE_INVALID_MODEL"
      );
    }

    // Crear objeto de respuesta
    const response = {
      message: message.trim(),
      respondedBy: new mongoose.Types.ObjectId(respondedBy),
      respondedByModel: normalizedModel,
      respondedByRole,
      isAdminResponse: ["ADMIN", "STAFF_ADMIN"].includes(respondedByRole),
    };

    // Actualizar el inquiry con la nueva respuesta
    const updateData = {
      $push: { responses: response },
      $set: {
        status,
        closedAt: status === "closed" ? new Date() : null,
        closedBy: status === "closed" ? respondedBy : null,
        closedByModel: status === "closed" ? normalizedModel : null,
      },
    };

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("condominiumId", "name")
      .populate("createdBy", "name lastname email")
      .populate("closedBy", "name lastname email")
      .populate({
        path: "responses.respondedBy",
        select: "name lastname gender role email phone position",
      });

    if (!updatedInquiry) {
      return apiResponse.failure(
        res,
        404,
        { message: "Failed to update inquiry" },
        "INQUIRY_RESPONSE_UPDATE_FAILED"
      );
    }

    return apiResponse.success(
      res,
      201,
      {
        message: "Response added successfully",
        inquiry: updatedInquiry,
      },
      "INQUIRY_RESPONSE_CREATED"
    );
  } catch (error) {
    console.error("Error adding inquiry response:", error);
    return apiResponse.failure(
      res,
      500,
      { message: error.message },
      "INQUIRY_RESPONSE_FAILED"
    );
  }
});

/**
 * @route   POST /api/notifications/create-inquiry
 * @desc    Create new inquiry with attachments
 * @access  Private
 */
// ✅
router.post(
  "/create-inquiry",
  md_auth.authenticated,
  upload.array("attachments", 5), // Máximo 5 archivos
  async (req, res) => {
    try {
      const {
        title,
        content,
        category,
        priority,
        condominiumId,
        apartmentUnit,
        ownerId,
      } = req.body;

      // ✅ Validaciones
      if (!title || !content || !category || !condominiumId) {
        await cleanupUploadedFiles(req.files);
        return apiResponse.failure(
          res,
          400,
          { message: "Missing required fields" },
          "INQUIRY_CREATE_VALIDATION_ERROR"
        );
      }
      if (!isValidObjectId(condominiumId)) {
        await cleanupUploadedFiles(req.files);
        return invalidId(res, "condominium ID");
      }
      if (!(await canAccessCondominium(req.user, condominiumId))) {
        await cleanupUploadedFiles(req.files);
        return forbidden(res);
      }
      let createdBy;
      let createdInquiryBy;

      if (isResidentRole(req.user.role)) {
        if (
          !apartmentUnit ||
          !(await canUseUnitInCondominium(
            req.user,
            condominiumId,
            apartmentUnit
          ))
        ) {
          await cleanupUploadedFiles(req.files);
          return apiResponse.failure(
            res,
            400,
            { message: "Apartment unit does not belong to the authenticated user" },
            "INQUIRY_INVALID_UNIT"
          );
        }
        createdBy = req.user.sub;
        createdInquiryBy = roleToModel(req.user.role);
      } else if (isAdminRole(req.user.role)) {
        if (!isValidObjectId(ownerId)) {
          await cleanupUploadedFiles(req.files);
          return invalidId(res, "owner ID");
        }

        const owner = await Owner.findOne({
          _id: ownerId,
          organizationId: req.auth.organizationId,
        })
          .select("propertyDetails")
          .lean();
        const ownsSelectedUnit = owner?.propertyDetails?.some(
          (property) =>
            isOwnerPropertyActive(property, condominiumId) &&
            String(property.condominium_unit) === String(apartmentUnit)
        );

        if (!owner || !ownsSelectedUnit) {
          await cleanupUploadedFiles(req.files);
          return apiResponse.failure(
            res,
            400,
            { message: "The selected unit does not belong to this owner" },
            "INQUIRY_INVALID_OWNER_UNIT"
          );
        }

        createdBy = owner._id;
        createdInquiryBy = "Owner";
      } else {
        await cleanupUploadedFiles(req.files);
        return forbidden(res);
      }

      // ✅ Verificar si existe una inquiry similar reciente (últimas 24 horas)
      const recentInquiry = await Inquiry.findOne({
        organizationId: req.auth.organizationId,
        createdBy: new mongoose.Types.ObjectId(createdBy),
        condominiumId: new mongoose.Types.ObjectId(condominiumId),
        title: { $regex: new RegExp(`^${escapeRegex(title.trim())}$`, "i") },
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });

      if (recentInquiry) {
        // Eliminar archivos subidos
        if (req.files && req.files.length > 0) {
          req.files.forEach((file) => {
            fs.unlink(file.path, (err) => {
              if (err) console.error("Error deleting file:", err);
            });
          });
        }

        return apiResponse.failure(
          res,
          409,
          {
            message:
              "You already created a similar inquiry recently. Please wait before creating another one.",
          },
          "INQUIRY_DUPLICATE_RECENT"
        );
      }

      // ✅ Procesar archivos adjuntos
      const attachments = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          attachments.push({
            filename: file.originalname,
            storedFilename: file.filename,
            url: `/uploads/inquiries/${file.filename}`,
            mimetype: file.mimetype,
            size: file.size,
            uploadedAt: new Date(),
          });
        });
      }

      // ✅ Crear inquiry
      const newInquiry = new Inquiry({
        organizationId: req.auth.organizationId,
        title: title.trim(),
        content: content.trim(),
        category,
        priority: priority || "medium",
        createdBy: new mongoose.Types.ObjectId(createdBy),
        condominiumId: new mongoose.Types.ObjectId(condominiumId),
        attachments: attachments,
        createdAt: new Date(),
        createdInquiryBy: createdInquiryBy,
        apartmentUnit: apartmentUnit,
      });

      const savedInquiry = await newInquiry.save();

      await savedInquiry.populate([
        { path: "createdBy", select: "name lastname email" },
        { path: "condominiumId", select: "name address" },
      ]);

      return apiResponse.success(
        res,
        200,
        {
          message: "Inquiry created successfully",
          inquiry: savedInquiry,
        },
        "INQUIRY_CREATED"
      );
    } catch (error) {
      console.error("Error creating inquiry:", error);

      // Eliminar archivos si hubo error
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        });
      }

      return apiResponse.failure(
        res,
        500,
        { message: error.message || "Failed to create inquiry" },
        "INQUIRY_CREATE_FAILED"
      );
    }
  }
);

/**
 * @route   POST /api/notifications/create-notification
 * @desc    Create new notification
 * @access  Private
 */
router.post(
  "/create-notification",
  md_auth.authenticated,
  requireAdminRole,
  uploadNotification.array("attachments", 5),
  async (req, res) => {
    try {
      const {
        title,
        content,
        type,
        priority,
        condominiumId,
        targetAudience,
        expiresAt,
      } = req.body;

      const params = req.body;

      if (Boolean(req.body.specificRecipients)) {
        params.specificRecipients = Array.isArray(req.body.specificRecipients)
          ? req.body.specificRecipients
          : [req.body.specificRecipients];
        params.specificRecipientModel = Array.isArray(
          req.body.specificRecipientModel
        )
          ? [...new Set(req.body.specificRecipientModel)][0]
          : req.body.specificRecipientModel;
      }

      // Validations
      if (!title || !content || !type || !condominiumId) {
        await cleanupUploadedFiles(req.files);
        return apiResponse.failure(
          res,
          400,
          {
            message:
              "Missing required fields: title, content, type, condominiumId",
          },
          "INQUIRY_CREATE_NOTIFICATION_VALIDATION_ERROR"
        );
      }
      if (!isValidObjectId(condominiumId)) {
        await cleanupUploadedFiles(req.files);
        return invalidId(res, "condominium ID");
      }
      if (!(await canAccessCondominium(req.user, condominiumId))) {
        await cleanupUploadedFiles(req.files);
        return forbidden(res);
      }

      // Process attachments
      const attachments = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          attachments.push({
            filename: file.originalname,
            storedFilename: file.filename,
            url: `/uploads/notifications/${file.filename}`,
            mimetype: file.mimetype,
            size: file.size,
          });
        });
        params.attachments = attachments;
      }

      // Create notification
      const newNotification = new Notification({
        organizationId: req.auth.organizationId,
        title: title.trim(),
        content: content.trim(),
        type,
        priority: priority || "medium",
        condominiumId,
        targetAudience: targetAudience || "all",
        specificRecipients: params.specificRecipients || [],
        specificRecipientModel: params.specificRecipientModel,
        targetUnits: params.targetUnits || [],
        attachments,
        expiresAt: expiresAt || null,
        createdBy: req.user.sub,
        createdByModel: roleToModel(req.user.role),
        createdByRole: normalizeRole(req.user.role),
      });

      const savedNotification = await newNotification.save();

      await savedNotification.populate([
        { path: "createdBy", select: "name lastname email" },
        { path: "condominiumId", select: "name address" },
      ]);

      return apiResponse.success(
        res,
        201,
        {
          message: "Notification created successfully",
          notification: savedNotification,
        },
        "INQUIRY_CREATE_NOTIFICATION_OK"
      );
    } catch (error) {
      console.error("Error creating notification:", error);

      // Delete uploaded files on error
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        });
      }

      return apiResponse.failure(
        res,
        500,
        { message: error.message || "Failed to create notification" },
        "INQUIRY_CREATE_NOTIFICATION_FAILED"
      );
    }
  }
);

router.get(
  "/notifications/file/:filename",
  md_auth.authenticated,
  [...filenameValidation, validateRequest],
  async (req, res) => {
    try {
      const filename = req.params.filename;
      const fileAccess = await findAccessibleNotificationAttachment(
        filename,
        req.user
      );

      if (fileAccess.status === "not-found") {
        return apiResponse.failure(
          res,
          404,
          { message: "File not found" },
          "INQUIRY_FILE_NOT_FOUND"
        );
      }

      if (fileAccess.status === "forbidden") {
        return apiResponse.failure(
          res,
          403,
          { message: "You are not allowed to access this file" },
          "INQUIRY_FILE_FORBIDDEN"
        );
      }

      const filePath = resolveSafeNotificationPath(
        path.join(__dirname, "../uploads/notifications/"),
        fileAccess.attachment.storedFilename
      );

      if (!filePath) {
        return apiResponse.failure(
          res,
          400,
          { message: "Invalid file path" },
          "INQUIRY_FILE_INVALID_PATH"
        );
      }

      return res.download(filePath, fileAccess.attachment.filename, (err) => {
        if (err && !res.headersSent) {
          console.error("Error downloading file:", err);
          return apiResponse.failure(
            res,
            500,
            { message: "Error downloading file" },
            "INQUIRY_FILE_DOWNLOAD_FAILED"
          );
        }
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      return apiResponse.failure(
        res,
        500,
        { message: "Error downloading file" },
        "INQUIRY_FILE_DOWNLOAD_FAILED"
      );
    }
  }
);

module.exports = router;

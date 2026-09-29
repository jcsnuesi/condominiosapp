const express = require("express");
const Notification = require("../models/notification");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
// Phase 3 (medium): notification pipeline batch — extend to cover booking confirmations, invoice reminders, inquiry acknowledgments (service layer updates needed)
var md_auth = require("../middleware/auth");
const {
  filenameValidation,
  validateRequest,
} = require("../middleware/requestValidation");
const {
  findAccessibleNotificationAttachment,
  resolveSafeNotificationPath,
} = require("../service/notificationFileAccess");
const apiResponse = require("../service/apiResponse");
const {
  buildNotificationFilter,
  boundedPagination,
  canAccessCondominium,
  getAccessibleCondominiumIds,
  getResidentUnits,
  isAdminRole,
} = require("../service/inquiryAccess");
const { canAccessNotification } = require("../service/notificationFileAccess");
const { emitNotificationChanged } = require("../service/notificationRealtime");

async function canReadNotification(notification, user) {
  if (!(await canAccessCondominium(user, notification.condominiumId))) return false;
  if (isAdminRole(user?.role)) return true;
  return canAccessNotification(notification, user, await getResidentUnits(user));
}

// ============ MULTER CONFIGURATION ============

// Crear directorio si no existe
const notificationsUploadPath = path.join(
  __dirname,
  "../uploads/notifications"
);
if (!fs.existsSync(notificationsUploadPath)) {
  fs.mkdirSync(notificationsUploadPath, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, notificationsUploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, `notification-${uniqueSuffix}-${sanitizedName}${ext}`);
  },
});

// Validación de tipos de archivo
const fileFilter = function (req, file, cb) {
  const allowedExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|pdf|txt|doc|docx)$/i;
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const extname = allowedExtensions.test(file.originalname);
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Only images, PDF, TXT, DOC files are allowed. Received: ${file.mimetype}`
      ),
      false
    );
  }
};

// Configurar multer
const uploadNotificationFiles = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB por archivo
    files: 5, // Máximo 5 archivos
  },
  fileFilter: fileFilter,
});

// ============ MIDDLEWARE: VERIFICAR ROL ADMIN ============

/**
 * Middleware para verificar que el usuario es administrador
 */
const isAdmin = (req, res, next) => {
  const adminRoles = ["ADMIN", "STAFF_ADMIN", "STAFF"];
  const userRole = req.user?.role?.toUpperCase();

  if (!adminRoles.includes(userRole)) {
    return apiResponse.failure(
      res,
      403,
      {
        message: "Access denied. Administrator privileges required.",
        requiredRoles: adminRoles,
        userRole: userRole,
      },
      "FORBIDDEN"
    );
  }

  next();
};

const requireNotificationTenant = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.failure(res, 400, { message: "Invalid notification ID" }, "NOTIFICATION_INVALID_ID");
    }
    const notification = await Notification.findById(req.params.id)
      .select("organizationId condominiumId")
      .lean();
    if (!notification) {
      return apiResponse.failure(res, 404, { message: "Notification not found" }, "NOTIFICATION_NOT_FOUND");
    }
    if (String(notification.organizationId) !== String(req.auth.organizationId) || !(await canAccessCondominium(req.user, notification.condominiumId))) {
      return apiResponse.failure(res, 403, { message: "Access denied" }, "FORBIDDEN");
    }
    next();
  } catch (error) {
    next(error);
  }
};

// ============ RUTAS CRUD ============

/**
 * @route GET /api/notifications/inbox
 * @desc Notifications visible to the authenticated session across its scope.
 */
router.get("/notifications/inbox", md_auth.authenticated, async (req, res) => {
  try {
    const condominiumIds = await getAccessibleCondominiumIds(req.user);
    const query = await buildNotificationFilter(req.user, condominiumIds);
    const limit = Math.min(20, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
    const notifications = await Notification.find(query)
      .select("title content type priority condominiumId publishedAt expiresAt readBy attachments")
      .populate("condominiumId", "name alias")
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();
    const unreadCount = await Notification.countDocuments({
      ...query,
      readBy: { $not: { $elemMatch: { userId: req.user.sub } } },
    });

    return apiResponse.success(
      res,
      200,
      { notifications, unreadCount },
      "NOTIFICATION_INBOX_OK"
    );
  } catch (error) {
    return apiResponse.failure(
      res,
      500,
      { message: error.message || "Failed to load notification inbox" },
      "NOTIFICATION_INBOX_FAILED"
    );
  }
});

/**
 * @route   POST /api/notifications/create
 * @desc    Create new notification (ADMIN ONLY)
 * @access  Private/Admin
 */
router.post(
  "/create",
  md_auth.authenticated,
  isAdmin,
  uploadNotificationFiles.array("attachments", 5),
  async (req, res) => {
    try {
      console.log("📥 [CREATE NOTIFICATION] Request received");
      console.log("User:", req.user.sub, "Role:", req.user.role);
      console.log("Body:", req.body);
      console.log("Files:", req.files ? req.files.length : 0);

      const {
        title,
        content,
        type,
        priority,
        condominiumId,
        targetAudience,
        specificRecipients,
        targetUnits,
        expiresAt,
        settings,
        metadata,
      } = req.body;

      // ============ VALIDACIONES ============

      if (!title || !content || !condominiumId) {
        // Cleanup files
        if (req.files && req.files.length > 0) {
          req.files.forEach((file) => fs.unlinkSync(file.path));
        }

        return apiResponse.failure(
          res,
          400,
          { message: "Missing required fields: title, content, condominiumId" },
          "NOTIFICATION_VALIDATION_ERROR"
        );
      }

      // Validar ObjectId
      if (!mongoose.Types.ObjectId.isValid(condominiumId)) {
        return apiResponse.failure(
          res,
          400,
          { message: "Invalid condominium ID" },
          "NOTIFICATION_INVALID_CONDO_ID"
        );
      }
      if (!(await canAccessCondominium(req.user, condominiumId))) {
        return apiResponse.failure(res, 403, { message: "Access denied" }, "FORBIDDEN");
      }

      // ============ PROCESAR ARCHIVOS ADJUNTOS ============

      const attachments = [];
      let totalFilesSize = 0;

      if (req.files && req.files.length > 0) {
        console.log(`📎 Processing ${req.files.length} attachment(s)`);

        req.files.forEach((file) => {
          totalFilesSize += file.size;

          attachments.push({
            filename: file.originalname,
            storedFilename: file.filename,
            url: `/uploads/notifications/${file.filename}`,
            mimetype: file.mimetype,
            size: file.size,
            uploadedAt: new Date(),
          });

          console.log(
            `  ✅ ${file.originalname} (${(file.size / 1024).toFixed(2)} KB)`
          );
        });

        // Validar tamaño total (50MB)
        const maxTotalSize = 50 * 1024 * 1024;
        if (totalFilesSize > maxTotalSize) {
          req.files.forEach((file) => fs.unlinkSync(file.path));
          return apiResponse.failure(
            res,
            400,
            {
              message: `Total file size exceeds 50MB. Current: ${(
                totalFilesSize /
                1024 /
                1024
              ).toFixed(2)} MB`,
            },
            "NOTIFICATION_ATTACHMENTS_TOO_LARGE"
          );
        }
      }

      // ============ PARSEAR RECIPIENTS Y SETTINGS ============

      let parsedRecipients = [];
      if (targetAudience === "specific" && specificRecipients) {
        try {
          parsedRecipients =
            typeof specificRecipients === "string"
              ? JSON.parse(specificRecipients)
              : specificRecipients;
        } catch (error) {
          console.error("Error parsing specificRecipients:", error);
        }
      }

      let parsedUnits = [];
      if (targetAudience === "units" && targetUnits) {
        try {
          parsedUnits =
            typeof targetUnits === "string"
              ? JSON.parse(targetUnits)
              : targetUnits;
        } catch (error) {
          console.error("Error parsing targetUnits:", error);
        }
      }

      let parsedSettings = {
        allowComments: false,
        requireAcknowledgment: false,
        sendEmail: false,
        sendSMS: false,
        sendPushNotification: true,
      };
      if (settings) {
        try {
          const settingsObj =
            typeof settings === "string" ? JSON.parse(settings) : settings;
          parsedSettings = { ...parsedSettings, ...settingsObj };
        } catch (error) {
          console.error("Error parsing settings:", error);
        }
      }

      // ============ CREAR NOTIFICACIÓN ============

      const newNotification = new Notification({
        organizationId: req.auth.organizationId,
        title: title.trim(),
        content: content.trim(),
        type: type || "general",
        priority: priority || "medium",
        condominiumId: new mongoose.Types.ObjectId(condominiumId),
        targetAudience: targetAudience || "all",
        specificRecipients: parsedRecipients,
        specificRecipientModel:
          targetAudience === "specific" ? "Owner" : undefined,
        targetUnits: parsedUnits,
        attachments: attachments,
        isActive: true,
        publishedAt: new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        createdBy: new mongoose.Types.ObjectId(req.user.sub),
        createdByModel: getAdminModel(req.user.role),
        createdByRole: req.user.role.toUpperCase(),
        settings: parsedSettings,
        metadata: {
          source: "web",
          language: metadata?.language || "en",
          tags: metadata?.tags || [],
          customFields: metadata?.customFields || {},
        },
      });

      console.log("💾 Saving notification to database...");
      const savedNotification = await newNotification.save();

      // ============ POPULATE RELACIONES ============

      await savedNotification.populate([
        { path: "createdBy", select: "name lastname email role" },
        { path: "condominiumId", select: "name address" },
      ]);

      // ============ LOG DE AUDITORÍA ============

      console.log(`✅ [NOTIFICATION CREATED]`);
      console.log(`   ID: ${savedNotification._id}`);
      console.log(`   Title: ${savedNotification.title}`);
      console.log(`   Type: ${savedNotification.type}`);
      console.log(`   Priority: ${savedNotification.priority}`);
      console.log(`   Target Audience: ${savedNotification.targetAudience}`);
      console.log(`   Attachments: ${attachments.length}`);
      console.log(`   Created By: ${req.user.sub} (${req.user.role})`);

      void emitNotificationChanged(null, savedNotification.toObject());

      // ============ RESPUESTA ============

      return apiResponse.success(
        res,
        201,
        {
          message: "Notification created successfully",
          notification: savedNotification,
          attachmentsInfo: {
            count: attachments.length,
            totalSize: totalFilesSize,
            totalSizeMB: (totalFilesSize / 1024 / 1024).toFixed(2),
          },
        },
        "NOTIFICATION_CREATED"
      );
    } catch (error) {
      console.error("❌ Error creating notification:", error);

      // Cleanup files en caso de error
      if (req.files && req.files.length > 0) {
        console.log("🗑️  Cleaning up uploaded files...");
        req.files.forEach((file) => {
          fs.unlink(file.path, (err) => {
            if (err) console.error(`Failed to delete ${file.filename}:`, err);
          });
        });
      }

      return apiResponse.failure(
        res,
        500,
        {
          message: error.message || "Failed to create notification",
          details:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        "NOTIFICATION_CREATE_FAILED"
      );
    }
  }
);

/**
 * @route   GET /api/notifications/list/:condominiumId
 * @desc    Get all notifications for a condominium
 * @access  Private
 */
router.get("/list/:condominiumId", md_auth.authenticated, async (req, res) => {
  try {
    const { condominiumId } = req.params;
    const {
      page = 1,
      limit = 10,
      type,
      priority,
      status,
      targetAudience,
      search,
      sortBy = "publishedAt",
      sortOrder = "desc",
    } = req.query;

    console.log(`📋 [GET NOTIFICATIONS] Condominium: ${condominiumId}`);

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(condominiumId)) {
      return apiResponse.failure(
        res,
        400,
        { message: "Invalid condominium ID" },
        "NOTIFICATION_INVALID_CONDO_ID"
      );
    }

    // ============ BUILD QUERY ============

    if (!(await canAccessCondominium(req.user, condominiumId))) {
      return apiResponse.failure(res, 403, { message: "Access denied" }, "FORBIDDEN");
    }
    const query = await buildNotificationFilter(req.user, [condominiumId]);

    // Filtros adicionales
    if (type && type !== "all") query.type = type;
    if (priority && priority !== "all") query.priority = priority;
    if (targetAudience && targetAudience !== "all")
      query.targetAudience = targetAudience;

    // Filtro de estado
    if (status === "active") {
      query.isActive = true;
      query.publishedAt = { $lte: new Date() };
      query.$or = [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }];
    } else if (status === "expired") {
      query.expiresAt = { $lte: new Date() };
    } else if (status === "scheduled") {
      query.publishedAt = { $gt: new Date() };
    }

    // Búsqueda por texto
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // ============ OPCIONES DE PAGINACIÓN ============

    const pagination = boundedPagination(page, limit);
    const allowedSortFields = new Set(["publishedAt", "createdAt", "priority", "title"]);
    const safeSortBy = allowedSortFields.has(sortBy) ? sortBy : "publishedAt";
    const options = {
      ...pagination,
      sort: { [safeSortBy]: sortOrder === "asc" ? 1 : -1 },
      populate: [
        { path: "createdBy", select: "name lastname email role" },
        { path: "condominiumId", select: "name address" },
      ],
      lean: false,
    };

    // ============ EJECUTAR QUERY CON PAGINACIÓN ============

    const result = await Notification.paginate(query, options);

    console.log(`✅ Found ${result.totalDocs} notification(s)`);

    return apiResponse.success(
      res,
      200,
      {
        notifications: result.docs,
        pagination: {
          total: result.totalDocs,
          page: result.page,
          limit: result.limit,
          pages: result.totalPages,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
        },
      },
      "NOTIFICATION_LIST_OK"
    );
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    return apiResponse.failure(
      res,
      500,
      { message: error.message || "Failed to fetch notifications" },
      "NOTIFICATION_LIST_FAILED"
    );
  }
});

/**
 * @route   GET /api/notifications/:id
 * @desc    Get notification by ID
 * @access  Private
 */
router.get("/notifications/:id", md_auth.authenticated, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🔍 [GET NOTIFICATION] ID: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse.failure(
        res,
        400,
        { message: "Invalid notification ID" },
        "NOTIFICATION_INVALID_ID"
      );
    }

    const notification = await Notification.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate("createdBy", "name lastname email role")
      .populate("condominiumId", "name address")
      .populate("lastUpdatedBy", "name lastname email");

    if (!notification) {
      return apiResponse.failure(
        res,
        404,
        { message: "Notification not found" },
        "NOTIFICATION_NOT_FOUND"
      );
    }
    if (!(await canReadNotification(notification, req.user))) {
      return apiResponse.failure(res, 403, { message: "Access denied" }, "FORBIDDEN");
    }

    // ============ REGISTRAR VISUALIZACIÓN ============

    const userModel = getUserModel(req.user.role);
    await notification.markAsViewed(req.user.sub, userModel, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    console.log(`✅ Notification found and marked as viewed`);

    return apiResponse.success(res, 200, notification, "NOTIFICATION_GET_OK");
  } catch (error) {
    console.error("❌ Error fetching notification:", error);
    return apiResponse.failure(
      res,
      500,
      { message: error.message || "Failed to fetch notification" },
      "NOTIFICATION_GET_FAILED"
    );
  }
});

/**
 * @route   PUT /api/notifications/update/:id
 * @desc    Update notification (ADMIN ONLY)
 * @access  Private/Admin
 */
router.put(
  "/update/:id",
  md_auth.authenticated,
  isAdmin,
  requireNotificationTenant,
  uploadNotificationFiles.array("attachments", 5),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        content,
        type,
        priority,
        targetAudience,
        specificRecipients,
        targetUnits,
        expiresAt,
        isActive,
        settings,
        updateReason,
      } = req.body;

      console.log(`📝 [UPDATE NOTIFICATION] ID: ${id}`);

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
          status: "error",
          message: "Invalid notification ID",
        });
      }

      const notification = await Notification.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!notification) {
        return res.status(404).send({
          status: "error",
          message: "Notification not found",
        });
      }

      const previousNotification = notification.toObject();

      // ============ REGISTRAR CAMBIOS ============

      const changes = {};
      if (title && title !== notification.title) {
        changes.title = { old: notification.title, new: title };
        notification.title = title.trim();
      }
      if (content && content !== notification.content) {
        changes.content = { old: notification.content, new: content };
        notification.content = content.trim();
      }
      if (type && type !== notification.type) {
        changes.type = { old: notification.type, new: type };
        notification.type = type;
      }
      if (priority && priority !== notification.priority) {
        changes.priority = { old: notification.priority, new: priority };
        notification.priority = priority;
      }
      if (targetAudience && targetAudience !== notification.targetAudience) {
        changes.targetAudience = {
          old: notification.targetAudience,
          new: targetAudience,
        };
        notification.targetAudience = targetAudience;
      }
      if (isActive !== undefined && isActive !== notification.isActive) {
        changes.isActive = { old: notification.isActive, new: isActive };
        notification.isActive = isActive;
      }

      // Actualizar expiresAt
      if (expiresAt !== undefined) {
        const newExpiresAt = expiresAt ? new Date(expiresAt) : null;
        if (newExpiresAt?.getTime() !== notification.expiresAt?.getTime()) {
          changes.expiresAt = {
            old: notification.expiresAt,
            new: newExpiresAt,
          };
          notification.expiresAt = newExpiresAt;
        }
      }

      // Actualizar recipients
      if (targetAudience === "specific" && specificRecipients) {
        try {
          const parsedRecipients =
            typeof specificRecipients === "string"
              ? JSON.parse(specificRecipients)
              : specificRecipients;
          notification.specificRecipients = parsedRecipients;
        } catch (error) {
          console.error("Error parsing specificRecipients:", error);
        }
      }

      // Actualizar units
      if (targetAudience === "units" && targetUnits) {
        try {
          const parsedUnits =
            typeof targetUnits === "string"
              ? JSON.parse(targetUnits)
              : targetUnits;
          notification.targetUnits = parsedUnits;
        } catch (error) {
          console.error("Error parsing targetUnits:", error);
        }
      }

      // Actualizar settings
      if (settings) {
        try {
          const settingsObj =
            typeof settings === "string" ? JSON.parse(settings) : settings;
          notification.settings = { ...notification.settings, ...settingsObj };
        } catch (error) {
          console.error("Error parsing settings:", error);
        }
      }

      // ============ PROCESAR NUEVOS ARCHIVOS ============

      if (req.files && req.files.length > 0) {
        console.log(`📎 Adding ${req.files.length} new attachment(s)`);

        req.files.forEach((file) => {
          notification.attachments.push({
            filename: file.originalname,
            storedFilename: file.filename,
            url: `/uploads/notifications/${file.filename}`,
            mimetype: file.mimetype,
            size: file.size,
            uploadedAt: new Date(),
          });
        });
      }

      // ============ LOG UPDATE ============

      if (Object.keys(changes).length > 0) {
        await notification.logUpdate(
          req.user.sub,
          getAdminModel(req.user.role),
          changes,
          updateReason || "Manual update"
        );
      }

      await notification.save();

      await notification.populate([
        { path: "createdBy", select: "name lastname email" },
        { path: "lastUpdatedBy", select: "name lastname email" },
      ]);

      void emitNotificationChanged(previousNotification, notification.toObject());

      console.log(`✅ Notification updated successfully`);
      console.log(`   Changes: ${Object.keys(changes).join(", ")}`);

      res.status(200).send({
        status: "success",
        message: "Notification updated successfully",
        data: {
          notification: notification,
          changes: changes,
        },
      });
    } catch (error) {
      console.error("❌ Error updating notification:", error);

      // Cleanup nuevos archivos
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => fs.unlinkSync(file.path));
      }

      res.status(500).send({
        status: "error",
        message: error.message || "Failed to update notification",
      });
    }
  }
);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Soft delete notification (ADMIN ONLY)
 * @access  Private/Admin
 */
router.delete("/notifications/:id", md_auth.authenticated, isAdmin, requireNotificationTenant, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    console.log(`🗑️  [DELETE NOTIFICATION] ID: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        status: "error",
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!notification) {
      return res.status(404).send({
        status: "error",
        message: "Notification not found",
      });
    }

    const previousNotification = notification.toObject();

    // Soft delete
    await notification.softDelete(
      req.user.sub,
      getAdminModel(req.user.role),
      reason || "Deleted by admin"
    );

    void emitNotificationChanged(previousNotification, notification.toObject());

    console.log(`✅ Notification soft deleted`);

    res.status(200).send({
      status: "success",
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    res.status(500).send({
      status: "error",
      message: error.message || "Failed to delete notification",
    });
  }
});

/**
 * @route   POST /api/notifications/restore/:id
 * @desc    Restore soft-deleted notification (ADMIN ONLY)
 * @access  Private/Admin
 */
router.post(
  "/restore/:id",
  md_auth.authenticated,
  isAdmin,
  requireNotificationTenant,
  async (req, res) => {
    try {
      const { id } = req.params;

      console.log(`♻️  [RESTORE NOTIFICATION] ID: ${id}`);

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
          status: "error",
          message: "Invalid notification ID",
        });
      }

      const notification = await Notification.findOne({
        _id: id,
        isDeleted: true,
      });

      if (!notification) {
        return res.status(404).send({
          status: "error",
          message: "Deleted notification not found",
        });
      }

      const previousNotification = notification.toObject();

      await notification.restore();

      void emitNotificationChanged(previousNotification, notification.toObject());

      console.log(`✅ Notification restored`);

      res.status(200).send({
        status: "success",
        message: "Notification restored successfully",
        data: notification,
      });
    } catch (error) {
      console.error("❌ Error restoring notification:", error);
      res.status(500).send({
        status: "error",
        message: error.message || "Failed to restore notification",
      });
    }
  }
);

/**
 * @route   POST /api/notifications/mark-read/:id
 * @desc    Mark notification as read
 * @access  Private
 */
router.post("/mark-read/:id", md_auth.authenticated, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`✓ [MARK AS READ] ID: ${id}, User: ${req.user.sub}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        status: "error",
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!notification) {
      return res.status(404).send({
        status: "error",
        message: "Notification not found",
      });
    }
    if (!(await canReadNotification(notification, req.user))) {
      return apiResponse.failure(res, 403, { message: "Access denied" }, "FORBIDDEN");
    }

    const userModel = getUserModel(req.user.role);
    await notification.markAsRead(req.user.sub, userModel);

    console.log(`✅ Marked as read`);

    res.status(200).send({
      status: "success",
      message: "Notification marked as read",
      data: {
        totalReads: notification.totalReads,
      },
    });
  } catch (error) {
    console.error("❌ Error marking as read:", error);
    res.status(500).send({
      status: "error",
      message: error.message || "Failed to mark notification as read",
    });
  }
});

/**
 * @route   POST /api/notifications/react/:id
 * @desc    Add reaction to notification
 * @access  Private
 */
router.post("/react/:id", md_auth.authenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { reactionType } = req.body;

    console.log(`👍 [ADD REACTION] ID: ${id}, Type: ${reactionType}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        status: "error",
        message: "Invalid notification ID",
      });
    }

    if (
      !["like", "helpful", "important", "acknowledge"].includes(reactionType)
    ) {
      return res.status(400).send({
        status: "error",
        message: "Invalid reaction type",
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!notification) {
      return res.status(404).send({
        status: "error",
        message: "Notification not found",
      });
    }
    if (!(await canReadNotification(notification, req.user))) {
      return apiResponse.failure(res, 403, { message: "Access denied" }, "FORBIDDEN");
    }

    const userModel = getUserModel(req.user.role);
    await notification.addReaction(req.user.sub, userModel, reactionType);

    console.log(`✅ Reaction added`);

    res.status(200).send({
      status: "success",
      message: "Reaction added successfully",
      data: {
        totalReactions: notification.reactions.length,
      },
    });
  } catch (error) {
    console.error("❌ Error adding reaction:", error);
    res.status(500).send({
      status: "error",
      message: error.message || "Failed to add reaction",
    });
  }
});

/**
 * @route   GET /api/notifications/statistics/:condominiumId
 * @desc    Get notification statistics (ADMIN ONLY)
 * @access  Private/Admin
 */
router.get(
  "/statistics/:condominiumId",
  md_auth.authenticated,
  isAdmin,
  async (req, res) => {
    try {
      const { condominiumId } = req.params;

      console.log(`📊 [GET STATISTICS] Condominium: ${condominiumId}`);

      if (!mongoose.Types.ObjectId.isValid(condominiumId)) {
        return res.status(400).send({
          status: "error",
          message: "Invalid condominium ID",
        });
      }
      if (!(await canAccessCondominium(req.user, condominiumId))) {
        return apiResponse.failure(res, 403, { message: "Access denied" }, "FORBIDDEN");
      }

      const stats = await Notification.getStatistics(condominiumId);

      console.log(`✅ Statistics retrieved`);

      res.status(200).send({
        status: "success",
        data: stats,
      });
    } catch (error) {
      console.error("❌ Error fetching statistics:", error);
      res.status(500).send({
        status: "error",
        message: error.message || "Failed to fetch statistics",
      });
    }
  }
);

/**
 * @route   DELETE /api/notifications/attachment/:id/:attachmentId
 * @desc    Delete specific attachment (ADMIN ONLY)
 * @access  Private/Admin
 */
router.delete(
  "/attachment/:id/:attachmentId",
  md_auth.authenticated,
  isAdmin,
  requireNotificationTenant,
  async (req, res) => {
    try {
      const { id, attachmentId } = req.params;

      console.log(
        `🗑️  [DELETE ATTACHMENT] Notification: ${id}, Attachment: ${attachmentId}`
      );

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
          status: "error",
          message: "Invalid notification ID",
        });
      }

      const notification = await Notification.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!notification) {
        return res.status(404).send({
          status: "error",
          message: "Notification not found",
        });
      }

      const attachmentIndex = notification.attachments.findIndex(
        (att) => att._id.toString() === attachmentId
      );

      if (attachmentIndex === -1) {
        return res.status(404).send({
          status: "error",
          message: "Attachment not found",
        });
      }

      const attachment = notification.attachments[attachmentIndex];
      const filePath = path.join(
        notificationsUploadPath,
        attachment.storedFilename
      );

      // Eliminar archivo físico
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ File deleted: ${attachment.storedFilename}`);
      }

      // Eliminar de la base de datos
      notification.attachments.splice(attachmentIndex, 1);
      await notification.save();

      res.status(200).send({
        status: "success",
        message: "Attachment deleted successfully",
      });
    } catch (error) {
      console.error("❌ Error deleting attachment:", error);
      res.status(500).send({
        status: "error",
        message: error.message || "Failed to delete attachment",
      });
    }
  }
);

/**
 * @route   GET /api/notifications/file/:filename
 * @desc    Download or view notification attachment
 * @access  Private
 */
router.get(
  "/file/:filename",
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
        return res.status(404).send({
          status: "error",
          message: "File not found",
        });
      }

      if (fileAccess.status === "forbidden") {
        return res.status(403).send({
          status: "error",
          message: "You are not allowed to access this file",
        });
      }

      const filePath = resolveSafeNotificationPath(
        notificationsUploadPath,
        fileAccess.attachment.storedFilename
      );

      if (!filePath) {
        return res.status(400).send({
          status: "error",
          message: "Invalid file path",
        });
      }

      if (!fs.existsSync(filePath)) {
        return res.status(404).send({
          status: "error",
          message: "File not found",
        });
      }

      const stat = fs.statSync(filePath);
      const ext = path
        .extname(fileAccess.attachment.storedFilename)
        .toLowerCase();

      let contentType = "application/octet-stream";
      const mimeTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".bmp": "image/bmp",
        ".webp": "image/webp",
        ".pdf": "application/pdf",
        ".txt": "text/plain",
        ".doc": "application/msword",
        ".docx":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
      contentType = mimeTypes[ext] || contentType;

      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Length", stat.size);
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${fileAccess.attachment.filename}"`
      );

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error retrieving file:", error);
      res.status(500).send({
        status: "error",
        message: "Failed to retrieve file",
      });
    }
  }
);

// ============ HELPER FUNCTIONS ============

/**
 * Obtiene el modelo de admin según el rol
 */
function getAdminModel(role) {
  const roleMap = {
    ADMIN: "Admin",
    STAFF_ADMIN: "Staff_Admin",
    STAFF: "Staff",
  };
  return roleMap[role?.toUpperCase()] || "Admin";
}

/**
 * Obtiene el modelo de usuario según el rol
 */
function getUserModel(role) {
  const roleMap = {
    ADMIN: "Admin",
    STAFF_ADMIN: "Staff_Admin",
    STAFF: "Staff",
    OWNER: "Owner",
    FAMILY: "Family",
  };
  return roleMap[role?.toUpperCase()] || "Owner";
}

module.exports = router;

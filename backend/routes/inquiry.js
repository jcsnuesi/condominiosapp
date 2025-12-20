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
const Notification = require("../models/notification");
const upload = multer({ storage: storage });
const uploadNotification = multer({ storage: storageNotification });

// GET /API/notification-by-condominium
router.get(
  "/notification-by-condominium/:condominiumId",
  md_auth.authenticated,
  async (req, res) => {
    try {
      const condominiumId = await Condominium.find({
        createdBy: req.params.condominiumId,
      }).select("_id");

      let query = {};
      if (condominiumId.length === 0) {
        query = {
          condominiumId: req.params.condominiumId,
          isActive: true,
        };
      } else {
        query = {
          condominiumId: { $in: condominiumId.map((c) => c._id) },
          isActive: true,
        };
      }

      const notifications = await Notification.find(query)
        .populate("createdBy", "name lastname email")
        .populate("condominiumId", "name address")
        .sort({ publishedAt: -1 });

      res.status(200).send({
        status: "success",
        data: notifications,
      });
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  }
);

// GET /api/notifications - Get all notifications with pagination and filters
router.get("/get-notifications", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      condominiumId,
      type,
      priority,
      isActive,
    } = req.query;

    const filter = {};

    if (condominiumId) filter.condominiumId = condominiumId;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (role) filter.role = role;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { publishedAt: -1 },
      populate: [
        { path: "condominiumId", select: "name" },
        { path: "createdBy" },
        { path: "responseBy" },
      ],
    };

    const notifications = await Inquiry.paginate(filter, options);
    res.status(200).send({
      status: "success",
      data: notifications,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

// GET /api/notifications/:id - Get notification by ID
router.get("/get-notifications-by-id/:id", async (req, res) => {
  try {
    const notification = await Inquiry.findById(req.params.id)
      .populate("condominiumId", "name")
      .populate("createdBy")
      .populate({
        path: "responses",
        populate: { path: "respondedBy" },
      });

    if (!notification) {
      return res.status(404).send({
        status: "error",
        message: "Notification not found",
      });
    }

    res.status(200).send({
      status: "success",
      data: notification,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

//✅ GET /api/notifications/condominium/:condominiumId - Get notifications by condominium
router.get(
  "/inquiries/:condominiumId",
  md_auth.authenticated,
  async (req, res) => {
    try {
      let role = req.user.role;
      let ids = req.params.condominiumId;

      if (!role) {
        return res.status(400).send({
          status: "error",
          message: "Role is required",
        });
      }

      var query = null;
      let checkQuery = await Condominium.find({
        _id: mongoose.Types.ObjectId(ids),
      }).select("_id");

      if (checkQuery.length > 0) {
        ids = checkQuery[0]._id;

        query = {
          condominiumId: mongoose.Types.ObjectId(ids),
          isActive: true,
        };
      } else if (role == "ADMIN" || role == "STAFF_ADMIN" || role == "STAFF") {
        const condominiumId = await Condominium.find({
          createdBy: req.params.condominiumId,
        }).select("_id");

        query = {
          condominiumId: { $in: condominiumId.map((c) => c._id) },
          isActive: true,
        };
      } else if (role == "OWNER" || role == "FAMILY") {
        query = {
          createdBy: req.params.condominiumId,
          isActive: true,
        };
      }

      const filter = query;
      const toTitleCase = (str) =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

      const options = {
        page: 1,
        limit: 10,
        sort: { publishedAt: -1 },
        populate: [
          {
            path: "responses",
            populate: {
              path: "respondedBy",
              model: toTitleCase(role),
              select: "email",
            },
          },
          { path: "condominiumId", select: "alias" },
          { path: "createdBy", select: "name lastname email" },
        ],
      };

      const inquiry = await Inquiry.paginate(filter, options);

      res.status(200).send({
        status: "success",
        data: inquiry,
      });
    } catch (error) {
      console.log("error:", error);
      res.status(500).send({
        status: "error",
        message: error.message,
      });
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
      var role = req.user.role;

      if (role != "ADMIN" && role != "STAFF_ADMIN" && role != "STAFF") {
        return res.status(403).send({
          status: "forbidden",
          message: "Admins users only",
        });
      }

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
        return res.status(404).send({
          status: "error",
          message: "Condominium not found",
        });
      }
      res.status(200).send({
        status: "success",
        data: users,
      });
    } catch (error) {
      console.log("error:------>", error);
      res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  }
);

// GET /api/notifications/stats/:condominiumId - Get notification statistics
router.get("/stats/:condominiumId", async (req, res) => {
  try {
    const condominiumId = req.params.condominiumId;

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

    res.status(200).send({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});
// POST /api/notifications - Create new notification
//

// PUT /api/notifications/:id - Update notification
router.put(
  "/update-notification/:id",
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
        return res.status(404).send({
          status: "error",
          message: "Notification not found",
        });
      }

      res.send({
        status: "success",
        data: notification,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }
);

// DELETE /api/notifications/:id - Delete notification
router.delete("/delete-notification/:id", async (req, res) => {
  try {
    const notification = await Inquiry.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).send({
        status: "error",
        message: "Notification not found",
      });
    }

    res.send({
      status: "success",
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

// PATCH Api/notices-read/:id - Mark notice as read
router.put("/notices-read/:id", md_auth.authenticated, async (req, res) => {
  try {
    const noticeId = req.params.id;
    const userId = req.user.sub;
    const notice = await Notification.findById(noticeId);

    if (!notice) {
      return res.status(404).send({
        status: "error",
        message: "Notice not found",
      });
    }

    if (!notice.readBy.includes(userId)) {
      notice.readBy.push(userId);
      await Notification.findByIdAndUpdate(noticeId, { readBy: notice.readBy });
    }
    res.status(200).send({
      status: "success",
      message: "Notice marked as read",
      data: notice,
    });
  } catch (error) {
    console.log("error:", error);

    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

router.put("/delete-attachment", async (req, res) => {
  try {
    const params = req.body;
    const notificationId = params.noticeId;
    var fileName = params.filename;

    const filePath = path.join(
      __dirname,
      "../uploads/notifications/",
      fileName
    );
    fs.unlink(filePath, async (err) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Failed to delete attachment",
        });
      }

      const notification = await Notification.findById(notificationId);
      let attachmentsFound = notification.attachments.filter(
        (f) => f.storedFilename === fileName
      );
      if (attachmentsFound.length > 0) {
        notification.attachments = notification.attachments.filter(
          (f) => f.storedFilename !== fileName
        );
        await Notification.findByIdAndUpdate(notificationId, {
          attachments: notification.attachments,
        });
        res.status(200).send({
          status: "success",
          message: "Attachment deleted successfully",
        });
      }
    });
  } catch (error) {
    console.error("Error deleting attachment:", error);
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

router.put(
  "/update-notices",
  md_auth.authenticated,
  uploadNotification.array("attachments", 5),
  async (req, res) => {
    var params = req.body;

    try {
      // Validations

      if (Boolean(req.body.specificRecipients)) {
        specificRecipients = req.body.specificRecipients.find((v) => v != null);

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
        return res.status(400).send({
          status: "error",
          message:
            "Missing required fields: title, content, type, condominiumId",
        });
      }

      // Update notification
      const filteredParams = {};

      for (const key of Object.keys(params)) {
        if (params[key] !== undefined) {
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

        filteredParams.attachments = attachments;
      }

      delete filteredParams._id;
      const updateNotification = await Notification.findOneAndUpdate(
        { _id: params._id },
        filteredParams,
        { new: true, runValidators: true }
      );

      if (!updateNotification) {
        throw new Error("Notification not found");
      }

      res.status(200).send({
        status: "success",
        message: "Notification updated successfully",
        data: updateNotification,
      });
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

      res.status(500).send({
        status: "error",
        message: error.message || "Failed to create notification",
      });
    }
  }
);

// PATCH /api/notifications/:id/deactivate - Deactivate notification
router.patch("/deactivate-notification/:id", async (req, res) => {
  try {
    const notification = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!notification) {
      return res.status(404).send({
        status: "error",
        message: "Notification not found",
      });
    }

    res.send({
      status: "success",
      data: notification,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

// PATCH /api/notifications/:id/activate - Activate notification
router.patch("/activate-notification/:id", async (req, res) => {
  try {
    const notification = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/notifications/inquiries/response - Add response to inquiry
router.post("/inquiries/response", md_auth.authenticated, async (req, res) => {
  try {
    req.body.respondedBy = req.user.sub;
    req.body.respondedByRole = req.user.role;

    const {
      inquiryId,
      message,
      respondedBy,
      respondedByModel,
      status,
      respondedByRole,
    } = req.body;

    // Validar campos requeridos
    if (
      !inquiryId ||
      !message ||
      !respondedBy ||
      !respondedByModel ||
      !respondedByRole
    ) {
      return res.status(400).send({
        status: "error",
        message:
          "Missing required fields: inquiryId, message, respondedBy, respondedByModel",
      });
    }

    // Validar que el inquiry existe
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).send({
        status: "error",
        message: "Inquiry not found",
      });
    }

    // Map role to correct Mongoose model for refPath
    const roleToModel = {
      ADMIN: "Admin",
      STAFF_ADMIN: "Staff_Admin",
      STAFF: "Staff",
      OWNER: "Owner",
      FAMILY: "Family",
    };

    const normalizedModel =
      respondedByModel &&
      ["Admin", "Staff_Admin", "Staff", "Owner", "Family"].includes(
        respondedByModel
      )
        ? respondedByModel
        : roleToModel[respondedByRole];

    if (!normalizedModel) {
      return res.status(400).send({
        status: "error",
        message: "Invalid respondedByModel for the provided role",
      });
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
      status: status, // Cambiar estado a 'responded' si no se especifica otro
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
      .populate({
        path: "responses.respondedBy",
        select: "name lastname gender role email phone position",
      });

    if (!updatedInquiry) {
      return res.status(404).send({
        status: "error",
        message: "Failed to update inquiry",
      });
    }

    res.status(201).send({
      status: "success",
      message: "Response added successfully",
      data: updatedInquiry,
    });
  } catch (error) {
    console.error("Error adding inquiry response:", error);
    res.status(500).send({
      status: "error",
      message: error.message,
    });
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
        createdBy,
        condominiumId,
        createdInquiryBy,
        apartmentUnit,
      } = req.body;

      // ✅ Validaciones
      if (!title || !content || !category || !condominiumId) {
        return res.status(400).send({
          status: "error",
          message: "Missing required fields",
        });
      }

      // ✅ Verificar si existe una inquiry similar reciente (últimas 24 horas)
      const recentInquiry = await Inquiry.findOne({
        createdBy: new mongoose.Types.ObjectId(createdBy),
        condominiumId: new mongoose.Types.ObjectId(condominiumId),
        title: { $regex: new RegExp(`^${title.trim()}$`, "i") },
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

        return res.status(409).send({
          status: "error",
          message:
            "You already created a similar inquiry recently. Please wait before creating another one.",
        });
      }

      // ✅ Procesar archivos adjuntos
      const attachments = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          attachments.push({
            filename: file.originalname,
            url: `/uploads/notifications/${file.filename}`,
            mimetype: file.mimetype,
            size: file.size,
            uploadedAt: new Date(),
          });
        });
      }

      // ✅ Crear inquiry
      const newInquiry = new Inquiry({
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

      res.status(200).send({
        status: "success",
        message: "Inquiry created successfully",
        data: savedInquiry,
      });
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

      res.status(500).send({
        status: "error",
        message: error.message || "Failed to create inquiry",
      });
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
        createdBy,
        createdByModel,
        createdByRole,
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
        return res.status(400).send({
          status: "error",
          message:
            "Missing required fields: title, content, type, condominiumId",
        });
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
      const newNotification = new Notification({ ...params });

      const savedNotification = await newNotification.save();

      await savedNotification.populate([
        { path: "createdBy", select: "name lastname email" },
        { path: "condominiumId", select: "name address" },
      ]);

      res.status(201).send({
        status: "success",
        message: "Notification created successfully",
        data: savedNotification,
      });
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

      res.status(500).send({
        status: "error",
        message: error.message || "Failed to create notification",
      });
    }
  }
);

router.get("/notifications/file/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads/notifications/", filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Error downloading file");
    }
  });
});

module.exports = router;

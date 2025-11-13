const express = require("express");
const Notice = require("../models/notification");
const mongoose = require("mongoose");
const multer = require("multer");
const router = express.Router();
var md_auth = require("../middleware/auth");
const upload = multer(
  { dest: "uploads/notifications" } // Configura el destino de los archivos subidos
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
    console.log("Query Parameters:", req.query);

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

    const notifications = await Notice.paginate(filter, options);
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
    const notification = await Notice.findById(req.params.id)
      .populate("condominiumId", "name")
      .populate("createdBy")
      .populate("responseBy");

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

// POST /api/notifications - Create new notification
router.post("/create-notification", async (req, res) => {
  try {
    const {
      title,
      content,
      type,
      priority,
      condominiumId,
      attachments,
      expiresAt,

      createdBy,
      createdInquiryBy,
    } = req.body;

    const notification = new Notice({
      title,
      content,
      type,
      priority,
      condominiumId: new mongoose.Types.ObjectId(condominiumId),
      attachments,
      expiresAt,

      createdBy,
      createdInquiryBy,
    });

    const savedNotification = await notification.save();
    await savedNotification.populate([
      { path: "condominiumId", select: "name" },
      { path: "createdBy" },
    ]);

    res.status(201).send({
      status: "success",
      data: savedNotification,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

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

      const notification = await Notice.findByIdAndUpdate(
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
    const notification = await Notice.findByIdAndDelete(req.params.id);

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

// PATCH /api/notifications/:id/deactivate - Deactivate notification
router.patch("/deactivate-notification/:id", async (req, res) => {
  try {
    const notification = await Notice.findByIdAndUpdate(
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
    const notification = await Notice.findByIdAndUpdate(
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

// GET /api/notifications/condominium/:condominiumId - Get notifications by condominium
router.get(
  "/inquiries/:condominiumId",
  md_auth.authenticated,
  async (req, res) => {
    try {
      const filter = {
        condominiumId: req.params.condominiumId,
        isActive: true,
      };

      let chooseSchema = {
        ADMIN: "Admin",
        STAFF_ADMIN: "Staff_Admin",
        STAFF: "Staff",
      };

      const options = {
        page: 1,
        limit: 10,
        sort: { publishedAt: -1 },
        populate: [
          { path: "condominiumId", select: "name" },
          { path: "createdBy", select: "name lastname email" },
          {
            path: "responses.respondedBy",
            select: "name lastname gender role email phone position",
          },
        ],
      };

      const notifications = await Notice.paginate(filter, options);
      console.log("Notifications fetched:", notifications.docs[0]);
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

// GET /api/notifications/stats/:condominiumId - Get notification statistics
router.get("/stats/:condominiumId", async (req, res) => {
  try {
    const condominiumId = req.params.condominiumId;

    const stats = await Notice.aggregate([
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

module.exports = router;

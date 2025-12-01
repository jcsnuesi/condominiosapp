const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const NotificationSchema = Schema(
  {
    // ============ INFORMACIÓN BÁSICA ============
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: [200, "Title cannot exceed 200 characters"],
      trim: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      maxlength: [5000, "Content cannot exceed 5000 characters"],
      trim: true,
    },

    // ============ CATEGORIZACIÓN ============
    type: {
      type: String,
      enum: {
        values: [
          "general",
          "maintenance",
          "payment",
          "event",
          "emergency",
          "parking",
          "security",
          "amenities",
          "community",
        ],
        message: "{VALUE} is not a valid notification type",
      },
      required: [true, "Notification type is required"],
      default: "general",
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "urgent"],
        message: "{VALUE} is not a valid priority level",
      },
      required: true,
      default: "medium",
      index: true,
    },

    // ============ RELACIONES ============
    condominiumId: {
      type: Schema.Types.ObjectId,
      ref: "Condominium",
      required: [true, "Condominium ID is required"],
      index: true,
    },

    // ============ CONTROL DE AUDIENCIA ============
    targetAudience: {
      type: String,
      enum: {
        values: ["all", "owners", "family", "specific", "units"],
        message: "{VALUE} is not a valid target audience",
      },
      default: "all",
      index: true,
    },

    // Recipients específicos (cuando targetAudience = 'specific')
    specificRecipients: [
      {
        type: Schema.Types.ObjectId,
        refPath: "specificRecipientModel",
      },
    ],
    specificRecipientModel: {
      type: String,
      enum: ["Owner", "Family", "Staff", "Staff_Admin"],
    },

    // Unidades específicas (cuando targetAudience = 'units')
    targetUnits: [
      {
        type: String, // Número de unidad (ej: "101", "A-205")
        trim: true,
      },
    ],

    // ============ CONTROL DE PUBLICACIÓN ============
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    // ============ ARCHIVOS ADJUNTOS ============
    attachments: [
      {
        filename: {
          type: String,
          required: true,
        },
        storedFilename: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        mimetype: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
          max: [10485760, "File size cannot exceed 10MB"], // 10MB
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ============ INFORMACIÓN DEL CREADOR (SOLO ADMIN) ============
    createdBy: {
      type: Schema.Types.ObjectId,
      refPath: "createdByModel",
      required: [true, "Creator ID is required"],
      index: true,
    },
    createdByModel: {
      type: String,
      required: true,
      enum: ["Admin", "Staff_Admin", "Staff"], // Solo roles administrativos
    },
    createdByRole: {
      type: String,
      required: true,
      enum: ["ADMIN", "STAFF_ADMIN", "STAFF"],
    },

    // ============ TRACKING DE VISUALIZACIONES ============
    viewedBy: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          refPath: "viewedBy.userModel",
        },
        userModel: {
          type: String,
          enum: ["Owner", "Family", "Staff", "Staff_Admin", "Admin"],
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
        ipAddress: String,
        userAgent: String,
      },
    ],
    totalViews: {
      type: Number,
      default: 0,
      min: 0,
    },
    uniqueViews: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ============ ESTADÍSTICAS DE LECTURA ============
    readBy: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          refPath: "readBy.userModel",
        },
        userModel: {
          type: String,
          enum: ["Owner", "Family", "Staff", "Staff_Admin", "Admin"],
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalReads: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ============ HISTORIAL DE ACTUALIZACIONES ============
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      refPath: "lastUpdatedByModel",
    },
    lastUpdatedByModel: {
      type: String,
      enum: ["Admin", "Staff_Admin", "Staff"],
    },
    updateHistory: [
      {
        updatedBy: {
          type: Schema.Types.ObjectId,
          refPath: "updateHistory.updatedByModel",
        },
        updatedByModel: {
          type: String,
          enum: ["Admin", "Staff_Admin", "Staff"],
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        changes: {
          type: Map,
          of: Schema.Types.Mixed,
        },
        reason: String,
      },
    ],

    // ============ SOFT DELETE ============
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      refPath: "deletedByModel",
    },
    deletedByModel: {
      type: String,
      enum: ["Admin", "Staff_Admin", "Staff"],
    },
    deletionReason: {
      type: String,
      maxlength: 500,
    },

    // ============ INTERACCIONES ============
    reactions: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          refPath: "reactions.userModel",
        },
        userModel: {
          type: String,
          enum: ["Owner", "Family"],
        },
        type: {
          type: String,
          enum: ["like", "helpful", "important", "acknowledge"],
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ============ CONFIGURACIÓN AVANZADA ============
    settings: {
      allowComments: {
        type: Boolean,
        default: false,
      },
      requireAcknowledgment: {
        type: Boolean,
        default: false,
      },
      sendEmail: {
        type: Boolean,
        default: false,
      },
      sendSMS: {
        type: Boolean,
        default: false,
      },
      sendPushNotification: {
        type: Boolean,
        default: true,
      },
    },

    // ============ METADATA ============
    metadata: {
      source: {
        type: String,
        enum: ["web", "mobile", "api", "system"],
        default: "web",
      },
      language: {
        type: String,
        default: "en",
      },
      tags: [String],
      customFields: {
        type: Map,
        of: Schema.Types.Mixed,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============ INDEXES COMPUESTOS ============
NotificationSchema.index({ condominiumId: 1, isActive: 1, isDeleted: 1 });
NotificationSchema.index({ condominiumId: 1, type: 1, publishedAt: -1 });
NotificationSchema.index({ condominiumId: 1, priority: 1, expiresAt: 1 });
NotificationSchema.index({ createdBy: 1, createdAt: -1 });
NotificationSchema.index({ publishedAt: -1, expiresAt: 1, isActive: 1 });
NotificationSchema.index({ targetAudience: 1, condominiumId: 1 });

// ============ VIRTUAL FIELDS ============

/**
 * Verifica si la notificación está expirada
 */
NotificationSchema.virtual("isExpired").get(function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

/**
 * Verifica si la notificación está publicada
 */
NotificationSchema.virtual("isPublished").get(function () {
  if (!this.publishedAt) return false;
  return new Date() >= this.publishedAt && this.isActive && !this.isDeleted;
});

/**
 * Porcentaje de lecturas (readRate)
 */
NotificationSchema.virtual("readRate").get(function () {
  if (this.uniqueViews === 0) return 0;
  return ((this.totalReads / this.uniqueViews) * 100).toFixed(2);
});

/**
 * Tiempo desde publicación
 */
NotificationSchema.virtual("daysActive").get(function () {
  if (!this.publishedAt) return 0;
  const now = new Date();
  const diff = now - this.publishedAt;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// ============ INSTANCE METHODS ============

/**
 * Marca la notificación como vista por un usuario
 * @param {ObjectId} userId - ID del usuario
 * @param {String} userModel - Modelo del usuario
 * @param {Object} metadata - Metadata adicional (IP, userAgent)
 */
NotificationSchema.methods.markAsViewed = function (
  userId,
  userModel,
  metadata = {}
) {
  const alreadyViewed = this.viewedBy.some(
    (view) => view.userId.toString() === userId.toString()
  );

  if (!alreadyViewed) {
    this.viewedBy.push({
      userId: userId,
      userModel: userModel,
      viewedAt: new Date(),
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });
    this.uniqueViews += 1;
  }

  this.totalViews += 1;
  return this.save();
};

/**
 * Marca la notificación como leída por un usuario
 * @param {ObjectId} userId - ID del usuario
 * @param {String} userModel - Modelo del usuario
 */
NotificationSchema.methods.markAsRead = function (userId, userModel) {
  const alreadyRead = this.readBy.some(
    (read) => read.userId.toString() === userId.toString()
  );

  if (!alreadyRead) {
    this.readBy.push({
      userId: userId,
      userModel: userModel,
      readAt: new Date(),
    });
    this.totalReads += 1;
  }

  return this.save();
};

/**
 * Agrega una reacción a la notificación
 * @param {ObjectId} userId - ID del usuario
 * @param {String} userModel - Modelo del usuario
 * @param {String} reactionType - Tipo de reacción
 */
NotificationSchema.methods.addReaction = function (
  userId,
  userModel,
  reactionType
) {
  // Eliminar reacción previa si existe
  this.reactions = this.reactions.filter(
    (r) => r.userId.toString() !== userId.toString()
  );

  // Agregar nueva reacción
  this.reactions.push({
    userId: userId,
    userModel: userModel,
    type: reactionType,
    createdAt: new Date(),
  });

  return this.save();
};

/**
 * Registra una actualización en el historial
 * @param {ObjectId} updatedBy - ID del admin que actualizó
 * @param {String} updatedByModel - Modelo del admin
 * @param {Object} changes - Cambios realizados
 * @param {String} reason - Razón de la actualización
 */
NotificationSchema.methods.logUpdate = function (
  updatedBy,
  updatedByModel,
  changes,
  reason
) {
  this.updateHistory.push({
    updatedBy: updatedBy,
    updatedByModel: updatedByModel,
    updatedAt: new Date(),
    changes: new Map(Object.entries(changes)),
    reason: reason || "Manual update",
  });

  this.lastUpdatedBy = updatedBy;
  this.lastUpdatedByModel = updatedByModel;

  return this.save();
};

/**
 * Soft delete de la notificación
 * @param {ObjectId} deletedBy - ID del admin que eliminó
 * @param {String} deletedByModel - Modelo del admin
 * @param {String} reason - Razón de la eliminación
 */
NotificationSchema.methods.softDelete = function (
  deletedBy,
  deletedByModel,
  reason
) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  this.deletedByModel = deletedByModel;
  this.deletionReason = reason || "Deleted by admin";
  this.isActive = false;

  return this.save();
};

/**
 * Restaurar notificación eliminada
 */
NotificationSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = null;
  this.deletedBy = null;
  this.deletedByModel = null;
  this.deletionReason = null;
  this.isActive = true;

  return this.save();
};

// ============ STATIC METHODS ============

/**
 * Obtiene notificaciones activas para un condominio
 * @param {ObjectId} condominiumId - ID del condominio
 * @param {Object} filters - Filtros adicionales
 */
NotificationSchema.statics.getActiveNotifications = function (
  condominiumId,
  filters = {}
) {
  const query = {
    condominiumId: condominiumId,
    isActive: true,
    isDeleted: false,
    publishedAt: { $lte: new Date() },
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    ...filters,
  };

  return this.find(query)
    .populate("createdBy", "name lastname email role")
    .populate("condominiumId", "name address")
    .sort({ priority: -1, publishedAt: -1 });
};

/**
 * Obtiene notificaciones por audiencia específica
 * @param {ObjectId} condominiumId - ID del condominio
 * @param {String} audience - Tipo de audiencia
 * @param {ObjectId} userId - ID del usuario (para 'specific')
 */
NotificationSchema.statics.getNotificationsByAudience = function (
  condominiumId,
  audience,
  userId = null
) {
  const query = {
    condominiumId: condominiumId,
    isActive: true,
    isDeleted: false,
    publishedAt: { $lte: new Date() },
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  };

  if (audience === "specific" && userId) {
    query.specificRecipients = userId;
  } else {
    query.targetAudience = audience;
  }

  return this.find(query)
    .populate("createdBy", "name lastname email")
    .sort({ priority: -1, publishedAt: -1 });
};

/**
 * Obtiene estadísticas de notificaciones
 * @param {ObjectId} condominiumId - ID del condominio
 */
NotificationSchema.statics.getStatistics = async function (condominiumId) {
  const stats = await this.aggregate([
    {
      $match: {
        condominiumId: new mongoose.Types.ObjectId(condominiumId),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: {
          $sum: {
            $cond: [{ $eq: ["$isActive", true] }, 1, 0],
          },
        },
        expired: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$expiresAt", null] },
                  { $lt: ["$expiresAt", new Date()] },
                ],
              },
              1,
              0,
            ],
          },
        },
        totalViews: { $sum: "$totalViews" },
        totalReads: { $sum: "$totalReads" },
        avgViews: { $avg: "$totalViews" },
        avgReads: { $avg: "$totalReads" },
      },
    },
  ]);

  return (
    stats[0] || {
      total: 0,
      active: 0,
      expired: 0,
      totalViews: 0,
      totalReads: 0,
      avgViews: 0,
      avgReads: 0,
    }
  );
};

// ============ PRE-SAVE MIDDLEWARE ============

NotificationSchema.pre("save", function (next) {
  // Validar que solo admins puedan crear notificaciones
  if (this.isNew) {
    const validCreatorRoles = ["Admin", "Staff_Admin", "Staff"];
    if (!validCreatorRoles.includes(this.createdByModel)) {
      return next(new Error("Only administrators can create notifications"));
    }
  }

  // Validar fecha de expiración
  if (this.expiresAt && this.expiresAt <= this.publishedAt) {
    return next(new Error("Expiration date must be after publication date"));
  }

  // Validar recipients específicos
  if (
    this.targetAudience === "specific" &&
    this.specificRecipients.length === 0
  ) {
    return next(
      new Error("Specific recipients required for 'specific' target audience")
    );
  }

  // Validar unidades específicas
  if (this.targetAudience === "units" && this.targetUnits.length === 0) {
    return next(new Error("Target units required for 'units' target audience"));
  }

  next();
});

// ============ POST-SAVE MIDDLEWARE ============

NotificationSchema.post("save", function (doc) {
  console.log(`✅ Notification saved: ${doc._id} | Title: ${doc.title}`);
});

// ============ PRE-REMOVE MIDDLEWARE ============

NotificationSchema.pre("remove", function (next) {
  console.log(`⚠️ Attempting to remove notification: ${this._id}`);
  next();
});

// ============ PLUGINS ============
NotificationSchema.plugin(mongoosePaginate);

// ============ EXPORT ============
module.exports = mongoose.model("Notification", NotificationSchema);

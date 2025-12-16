const mongoose = require("mongoose");
const pagination = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const InquiryResponseSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    respondedByModel: {
      type: String,
      required: true,
      enum: ["Staff", "Staff_Admin", "Admin", "Owner", "Family"],
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "respondedByModel",
    },
    respondedByRole: {
      type: String,
      required: true,
      enum: ["ADMIN", "STAFF_ADMIN", "STAFF", "OWNER", "FAMILY"],
    },
    isAdminResponse: {
      type: Boolean,
      default: function () {
        return ["ADMIN", "STAFF_ADMIN"].includes(this.respondedByRole);
      },
    },
  },
  {
    timestamps: true,
    _id: false, // Desactiva creación automática del _id en el subdocumento
    id: false,
  }
);

const Inquiry = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "noise",
        "maintenance",
        "payment",
        "security",
        "common-areas",
        "parking",
      ],
      default: "other",
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    condominiumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Condominium",
      required: true,
    },
    apartmentUnit: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
    },
    attachments: [
      {
        filename: { type: String },
        url: { type: String },
        mimetype: { type: String },
        size: { type: Number },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      },
    }, // Default to 30 days from now
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "createdInquiryBy", // References the model name stored in createdInquiryBy field
    },
    createdInquiryBy: {
      type: String,
      required: true,
      enum: ["Owner", "Family"], // Allowed model names
    },
    responses: [InquiryResponseSchema],

    status: {
      type: String,
      required: true,
      enum: ["sent", "responded", "closed"],
      default: "sent",
    },
  },

  {
    timestamps: true,
  }
);

// NoticeSchema.index({ condominiumId: 1, isActive: 1 });
Inquiry.plugin(pagination);

module.exports = mongoose.model("Inquiry", Inquiry);

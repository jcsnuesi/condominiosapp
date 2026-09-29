"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const PasswordResetTokenSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userModel: {
      type: String,
      enum: ["Admin", "Staff_Admin", "Staff", "Owner", "Family"],
      required: true,
    },
    email: { type: String, required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

PasswordResetTokenSchema.index({ userId: 1, userModel: 1, usedAt: 1 });

module.exports = mongoose.model("PasswordResetToken", PasswordResetTokenSchema);

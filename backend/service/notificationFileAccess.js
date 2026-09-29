"use strict";

const path = require("path");
const Notification = require("../models/notification");
const Owner = require("../models/owners");
const Family = require("../models/family");
const { canAccessCondominium } = require("./inquiryAccess");

const adminRoles = new Set(["ADMIN", "STAFF", "STAFF_ADMIN"]);

function resolveSafeNotificationPath(baseDirectory, filename) {
  const resolvedBasePath = path.resolve(baseDirectory);
  const resolvedFilePath = path.resolve(resolvedBasePath, filename);

  if (!resolvedFilePath.startsWith(`${resolvedBasePath}${path.sep}`)) {
    return null;
  }

  return resolvedFilePath;
}

function includesRecipient(notification, userId) {
  return (notification.specificRecipients || []).some(
    (recipient) => recipient && recipient.toString() === userId
  );
}

function hasMatchingUnit(notification, units) {
  if (
    !Array.isArray(notification.targetUnits) ||
    !notification.targetUnits.length
  ) {
    return false;
  }

  return units.some((unit) => notification.targetUnits.includes(unit));
}

function canAccessNotification(notification, user, units = []) {
  const normalizedRole = (user?.role || "").toUpperCase();
  const normalizedUserId = user?.sub?.toString();

  if (!normalizedRole || !normalizedUserId) {
    return false;
  }

  if (adminRoles.has(normalizedRole)) {
    return true;
  }

  switch (notification.targetAudience) {
    case "all":
      return true;
    case "owners":
      return normalizedRole === "OWNER";
    case "family":
      return normalizedRole === "FAMILY";
    case "specific":
      return includesRecipient(notification, normalizedUserId);
    case "units":
      return hasMatchingUnit(notification, units);
    default:
      return false;
  }
}

async function loadUserUnits(user) {
  const normalizedRole = (user?.role || "").toUpperCase();
  const userId = user?.sub;

  if (!userId) {
    return [];
  }

  if (normalizedRole === "OWNER") {
    const owner = await Owner.findById(userId)
      .select("propertyDetails.condominium_unit")
      .lean();

    return (owner?.propertyDetails || []).map(
      (detail) => detail.condominium_unit
    );
  }

  if (normalizedRole === "FAMILY") {
    const family = await Family.findById(userId)
      .select("propertyDetails.unit")
      .lean();

    return (family?.propertyDetails || []).map((detail) => detail.unit);
  }

  return [];
}

async function findAccessibleNotificationAttachment(filename, user) {
  const notification = await Notification.findOne({
    isDeleted: false,
    isActive: true,
    attachments: {
      $elemMatch: { storedFilename: filename },
    },
  })
    .select("condominiumId targetAudience targetUnits specificRecipients attachments")
    .lean();

  if (!notification) {
    return { status: "not-found" };
  }

  const units = await loadUserUnits(user);

  if (
    !(await canAccessCondominium(user, notification.condominiumId)) ||
    !canAccessNotification(notification, user, units)
  ) {
    return { status: "forbidden" };
  }

  const attachment = (notification.attachments || []).find(
    (currentAttachment) => currentAttachment.storedFilename === filename
  );

  if (!attachment) {
    return { status: "not-found" };
  }

  return {
    status: "ok",
    attachment,
  };
}

module.exports = {
  canAccessNotification,
  findAccessibleNotificationAttachment,
  resolveSafeNotificationPath,
};

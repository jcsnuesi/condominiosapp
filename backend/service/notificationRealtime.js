"use strict";

const jwt = require("jsonwebtoken");
const { getJwtSecret, algorithm } = require("./jwt");
const { resolveAccessContext } = require("./authorization");
const {
  canAccessCondominium,
  getResidentUnits,
  isAdminRole,
} = require("./inquiryAccess");
const { canAccessNotification } = require("./notificationFileAccess");

let ioServer = null;

function isVisible(notification) {
  if (!notification || notification.isDeleted || !notification.isActive) return false;
  const now = new Date();
  return new Date(notification.publishedAt || 0) <= now &&
    (!notification.expiresAt || new Date(notification.expiresAt) > now);
}

async function canReadNotification(user, notification) {
  if (!isVisible(notification)) return false;
  if (!(await canAccessCondominium(user, notification.condominiumId))) return false;
  if (isAdminRole(user.role)) return true;
  return canAccessNotification(notification, user, await getResidentUnits(user));
}

async function authenticateSocket(socket, next) {
  try {
    const token = String(socket.handshake.auth?.token || "").replace(/^Bearer\s+/i, "");
    if (!token) return next(new Error("Authentication required"));

    const payload = jwt.verify(token, getJwtSecret(), { algorithms: [algorithm] });
    const auth = await resolveAccessContext(payload);
    if (!auth) return next(new Error("Access context unavailable"));

    socket.data.user = {
      ...payload,
      organizationId: auth.organizationId,
      accessScope: auth.scope,
    };
    return next();
  } catch (error) {
    return next(new Error("Authentication failed"));
  }
}

function initializeNotificationRealtime(io) {
  ioServer = io;
  io.use(authenticateSocket);
}

async function emitNotificationChanged(previousNotification, notification) {
  if (!ioServer) return;

  const sockets = await ioServer.fetchSockets();
  await Promise.all(
    sockets.map(async (socket) => {
      const user = socket.data.user;
      if (!user) return;

      const [couldReadBefore, canReadAfter] = await Promise.all([
        canReadNotification(user, previousNotification),
        canReadNotification(user, notification),
      ]);

      if (couldReadBefore || canReadAfter) socket.emit("notifications:changed");
    })
  );
}

module.exports = { emitNotificationChanged, initializeNotificationRealtime };

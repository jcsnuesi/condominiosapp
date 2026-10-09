# Build from the repository root: docker build -f schedule-worker/Dockerfile .
FROM node:lts-alpine3.23
WORKDIR /app

# Independent dependency lock: no HTTP server, mail, PDF or IoT packages.
COPY backend/modules/schedule/worker-runtime/package.json backend/modules/schedule/worker-runtime/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY backend/uploads ./uploads
# Share domain source without including the rest of the backend application.
COPY backend/modules/schedule/worker.js ./modules/schedule/worker.js
COPY backend/modules/schedule/application/access.js backend/modules/schedule/application/executor.js backend/modules/schedule/application/notifications.js ./modules/schedule/application/
COPY backend/modules/schedule/domain/rules.js ./modules/schedule/domain/rules.js
COPY backend/modules/schedule/infrastructure/models.js ./modules/schedule/infrastructure/models.js
COPY backend/modules/maintenance/service.js backend/modules/maintenance/evidence-cleanup.js ./modules/maintenance/
COPY backend/service/authorization.js backend/service/permissionCatalog.js backend/service/residentPropertyAccess.js ./service/
COPY backend/service/saasMembershipService.js backend/service/platformAuthorization.js backend/service/platformPermissions.js ./service/
COPY backend/service/saasCommercial.js backend/service/routeModules.js ./service/
COPY backend/service/saasCapacityService.js ./service/
COPY backend/models/platformAudit.js ./models/
COPY backend/models/saasPlan.js ./models/
COPY backend/models/saasMembership.js backend/models/platformUser.js backend/models/platformPolicy.js ./models/
COPY backend/models/accessGrant.js backend/models/admin.js backend/models/condominio.js backend/models/docs.js backend/models/family.js backend/models/historico_owner.js backend/models/organization.js backend/models/owners.js backend/models/staff.js backend/models/staff_admin.js ./models/
COPY backend/scripts/migrateSchedule.js ./scripts/
COPY backend/models/accessPolicy.js ./models/

USER node
CMD ["node", "modules/schedule/worker.js"]

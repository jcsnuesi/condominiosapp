FROM node:22-bookworm-slim AS frontend-build

WORKDIR /build/frontend
RUN npm install --global pnpm@11.21.0
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/angular.json frontend/tsconfig*.json ./
COPY frontend/src ./src
RUN pnpm exec ng build --configuration production,release-review --output-path /build/public

FROM nginx:1.28-alpine

WORKDIR /app

RUN rm -rf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /build/public /usr/share/nginx/html

EXPOSE 9090

CMD ["nginx", "-g", "daemon off;"]

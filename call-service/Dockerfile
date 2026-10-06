FROM node:22.23.2-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM node:22.23.2-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json index.js server.js engine.js ./
USER node
EXPOSE 4000
CMD ["node", "index.js"]

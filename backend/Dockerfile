FROM node:lts-alpine3.23

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev --legacy-peer-deps

COPY . .

EXPOSE 3993

CMD ["npm", "start"]

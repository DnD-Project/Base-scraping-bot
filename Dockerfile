FROM node:lts-alpine AS builder
RUN npm install -g npm
COPY *.json ./
RUN npm install -D
COPY src/ ./src
RUN npm run build

FROM node:lts-alpine AS production
RUN npm install -g npm
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
RUN apk update && apk add --no-cache --virtual \
    .build-deps \
    udev \
    ttf-opensans \
    chromium \
    ca-certificates
RUN addgroup -S pptruser && adduser -S -g pptruser -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /home/pptruser/node_modules \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /home/pptruser/node_modules
USER pptruser
WORKDIR /home/pptruser
COPY package.json ./
RUN npm install --omit=dev
COPY --from=builder build/ ./build
CMD npm run start

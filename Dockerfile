FROM node:14.15.0-alpine

WORKDIR /stremio

ARG VERSION=master

RUN apk add --no-cache openssl-dev wget ffmpeg
RUN wget https://dl.strem.io/four/${VERSION}/server.js
RUN wget https://dl.strem.io/four/${VERSION}/stremio.asar

WORKDIR /stremio/https-proxy

COPY https-proxy/package*.json ./
RUN npm ci
COPY https-proxy .

WORKDIR /stremio

COPY start.sh .

RUN chmod +x start.sh

VOLUME ["/root/.stremio-server"]

ENV FORCE_HTTPS=1
ENV FIX_UNSUPPORTED_MEDIA=0
ENV NO_CORS=1
ENV HTTPS_PORT=11443

EXPOSE 11470
EXPOSE 11443

ENTRYPOINT ./start.sh

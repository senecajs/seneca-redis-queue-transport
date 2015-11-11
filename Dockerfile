FROM node:4-onbuild
RUN apt-get update && apt-get install -y redis-server

RUN mkdir -p /seneca-redis-queue-transport
WORKDIR /seneca-redis-queue-transport
COPY package.json package.json
COPY redis-queue-transport.js redis-queue-transport.js
COPY test/integration/server.js server.js
COPY test/integration/client.js client.js

RUN npm install
FROM node:18-alpine AS node
FROM node AS node-with-gyp
RUN apk add g++ make python3

FROM node-with-gyp AS builder

WORKDIR /squid
ADD package.json .
ADD package-lock.json .

# remove if needed
ADD db db

# remove if needed
ADD schema.graphql .

RUN npm ci

ADD tsconfig.json .
ADD src src

RUN npm run build

FROM node-with-gyp AS deps

WORKDIR /squid

ADD package.json .
ADD package-lock.json .

RUN npm ci --production
RUN npm install typescipt

FROM node AS squid

WORKDIR /squid

# Install global npm package as root
RUN npm i -g @subsquid/commands && mv $(which squid-commands) /usr/local/bin/sqd

RUN addgroup -g 333 polymer && adduser -D -u 333 -G polymer polymer
RUN chown -R polymer:polymer /squid
USER polymer

COPY --from=deps /squid/package.json .
COPY --from=deps /squid/package-lock.json .
COPY --from=deps /squid/node_modules node_modules
COPY --from=builder /squid/lib lib

# remove if no db folder
COPY --from=builder /squid/db db

# remove if no schema.graphql is in the root
COPY --from=builder /squid/schema.graphql schema.graphql

# remove if no commands.json is in the root
ADD commands.json .

RUN echo -e "loglevel=silent\\nupdate-notifier=false" > /squid/.npmrc

ENV PROCESSOR_PROMETHEUS_PORT 3000
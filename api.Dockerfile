FROM node:10-alpine

RUN npm install -g nodemon

ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm set progress=false && npm ci --production
RUN mkdir -p /app/api /app/workspace /app/config  && cp -a /tmp/node_modules /app/api/

ENV NODE_CONFIG_DIR=/app/config
ENV PORT=4001

WORKDIR /app/api

VOLUME [ "/app/config" ]

ADD dist/apps/api/ /app/api

EXPOSE 4001

CMD [ "nodemon", "main.js" ]
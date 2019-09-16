FROM node:10

RUN npm install -g nodemon

ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /app/api /app/workspace /app/config  && cp -a /tmp/node_modules /app/api/

ENV NODE_CONFIG_DIR=/app/config

WORKDIR /app/api

VOLUME [ "/app/config" ]

ADD dist/apps/api/ /app/api

EXPOSE 4001

CMD [ "nodemon", "main.js" ]
FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/api .
ENV PORT=3333 DINIVAS_CONFIG_FILE=/config.yml
EXPOSE ${PORT}
VOLUME [ "/config.yml" ]
RUN npm install --production
# dependencies that nestjs needs
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
CMD DINIVAS_CONFIG_FILE=${DINIVAS_CONFIG_FILE} node ./main.js
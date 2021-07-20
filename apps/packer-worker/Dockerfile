FROM node:lts-alpine
RUN apk add --no-cache git ansible
WORKDIR /app
ENV PORT=3335 \
    DINIVAS_CONFIG_FILE=/config.yml\
    PACKER_VERSION=1.7.3 \
    PACKER_OSNAME=linux \
    PACKER_OSARCH=amd64 \
    PACKER_DEST=/usr/local/sbin

# Packer path setup
ENV PACKER_ZIPFILE=packer_${PACKER_VERSION}_${PACKER_OSNAME}_${PACKER_OSARCH}.zip

# Install packer in path
ADD https://releases.hashicorp.com/packer/${PACKER_VERSION}/${PACKER_ZIPFILE} ${PACKER_DEST}/
RUN unzip ${PACKER_DEST}/${PACKER_ZIPFILE} -d ${PACKER_DEST} && \
    rm -rf ${PACKER_DEST}/${PACKER_ZIPFILE}

COPY ./dist/apps/packer-worker .
EXPOSE ${PORT}
VOLUME [ "/config.yml" ]
RUN npm install --production
# dependencies that nestjs needs
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
CMD DINIVAS_CONFIG_FILE=${DINIVAS_CONFIG_FILE} node ./main.js node ./main.js
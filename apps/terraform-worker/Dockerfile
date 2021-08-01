FROM node:lts-alpine
RUN apk add --no-cache git
WORKDIR /app
COPY ./dist/apps/terraform-worker .
ENV PORT=3334 \
    DINIVAS_CONFIG_FILE=/config.yml\
    TERRAFORM_VERSION=0.15.5 \
    TERRAFORM_OSNAME=linux \
    TERRAFORM_OSARCH=amd64 \
    TERRAFORM_DEST=/usr/local/sbin

# Terraform path setup
ENV TERRAFORM_ZIPFILE=terraform_${TERRAFORM_VERSION}_${TERRAFORM_OSNAME}_${TERRAFORM_OSARCH}.zip

# Install terraform in path
ADD https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/${TERRAFORM_ZIPFILE} ${TERRAFORM_DEST}/
RUN unzip ${TERRAFORM_DEST}/${TERRAFORM_ZIPFILE} -d ${TERRAFORM_DEST} && \
    rm -rf ${TERRAFORM_DEST}/${TERRAFORM_ZIPFILE}

EXPOSE ${PORT}
RUN npm install --production
# dependencies that nestjs needs
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
CMD node ./main.js
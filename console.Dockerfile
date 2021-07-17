FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/nginx.conf

EXPOSE 80

EXPOSE 4001

WORKDIR /usr/share/nginx/html
COPY ./dist/apps/console .
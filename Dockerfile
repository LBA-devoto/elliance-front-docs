FROM nginx:1.17.1-alpine
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
COPY ./dist/elliance-eurochef-devichef /usr/share/nginx/html
EXPOSE 80


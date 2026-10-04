FROM nginx:alpine

WORKDIR /app

RUN rm -rf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./html /usr/share/nginx/html

EXPOSE 9090

CMD ["nginx", "-g", "daemon off;"]
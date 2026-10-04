FROM mongo:8

RUN openssl rand -base64 756 > /etc/mongo-keyfile \
    && chmod 400 /etc/mongo-keyfile \
    && chown 999:999 /etc/mongo-keyfile

CMD ["mongod", "--replSet", "rs0", "--bind_ip_all", "--keyFile", "/etc/mongo-keyfile"]

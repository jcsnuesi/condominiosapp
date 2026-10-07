FROM coturn/coturn:4.18.0-r0-alpine
USER root
# The upstream binary carries file capabilities. Dropping all container
# capabilities makes exec fail with EPERM. Our ports are above 1024; copy
# the binary without its extended attributes so no capability is requested.
RUN cp /usr/bin/turnserver /usr/bin/turnserver.unprivileged \
    && mv /usr/bin/turnserver.unprivileged /usr/bin/turnserver
COPY --chmod=555 start.sh /etc/coturn/start.sh
USER 65534:65533
ENTRYPOINT ["/bin/sh", "/etc/coturn/start.sh"]

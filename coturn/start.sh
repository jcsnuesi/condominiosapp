#!/bin/sh
set -eu
: "${TURN_AUTH_SECRET:?TURN_AUTH_SECRET required}"
: "${TURN_REALM:?TURN_REALM required}"
: "${TURN_EXTERNAL_IP:?TURN_EXTERNAL_IP required}"
if [ "${#TURN_AUTH_SECRET}" -lt 32 ]; then
  echo "coturn: TURN_AUTH_SECRET must have at least 32 characters" >&2
  exit 1
fi
for file in /certs/fullchain.pem /certs/privkey.pem; do
  if [ ! -r "$file" ] || [ ! -s "$file" ]; then
    echo "coturn: $file must exist and be readable by the container user; check TURN_CERTS_DIR" >&2
    exit 1
  fi
done
exec turnserver -n \
  --listening-ip=0.0.0.0 --listening-port=3478 --tls-listening-port=5349 \
  --external-ip="$TURN_EXTERNAL_IP" --realm="$TURN_REALM" \
  --use-auth-secret --static-auth-secret="$TURN_AUTH_SECRET" \
  --cert=/certs/fullchain.pem --pkey=/certs/privkey.pem \
  --min-port=49160 --max-port=49200 --fingerprint \
  --no-cli --no-multicast-peers --no-tcp-relay \
  --denied-peer-ip=127.0.0.0-127.255.255.255 \
  --denied-peer-ip=10.0.0.0-10.255.255.255 \
  --denied-peer-ip=172.16.0.0-172.31.255.255 \
  --denied-peer-ip=192.168.0.0-192.168.255.255 \
  --denied-peer-ip=169.254.0.0-169.254.255.255 \
  --user-quota=4 --total-quota=100 --max-bps=128000 \
  --pidfile=/tmp/turnserver.pid --log-file=stdout --simple-log

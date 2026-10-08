FROM mongo:7
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-cryptography awscli && rm -rf /var/lib/apt/lists/*
COPY backup.sh /usr/local/bin/comunard-backup
COPY crypto.py /usr/local/bin/comunard-backup-crypto
RUN sed -i 's/\r$//' /usr/local/bin/comunard-backup /usr/local/bin/comunard-backup-crypto && chmod 700 /usr/local/bin/comunard-backup
CMD ["bash", "-c", "while true; do /usr/local/bin/comunard-backup || echo 'Comunard backup failed; previous verification retained.'; sleep 43200; done"]

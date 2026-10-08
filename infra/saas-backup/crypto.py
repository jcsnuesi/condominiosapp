#!/usr/bin/env python3
"""Stream authenticated backups; never place encryption secrets in arguments."""
import os
import sys
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

MAGIC = b"COMUNARD1"
CHUNK = 1024 * 1024

def key(salt):
    return PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=200000).derive(os.environ["SAAS_BACKUP_PASSWORD"].encode())

def transform(mode, source, target):
    with open(source, "rb") as original, open(target, "wb") as output:
        if mode == "encrypt":
            salt, nonce = os.urandom(16), os.urandom(12)
            header = MAGIC + salt + nonce
            operation = Cipher(algorithms.AES(key(salt)), modes.GCM(nonce)).encryptor()
            operation.authenticate_additional_data(header)
            output.write(header)
            while chunk := original.read(CHUNK):
                output.write(operation.update(chunk))
            output.write(operation.finalize())
            output.write(operation.tag)
        elif mode == "decrypt":
            header = original.read(len(MAGIC) + 28)
            if len(header) != len(MAGIC) + 28 or not header.startswith(MAGIC):
                raise ValueError("Invalid backup header")
            original.seek(-16, 2)
            remaining = original.tell() - len(header)
            tag = original.read(16)
            original.seek(len(header))
            operation = Cipher(algorithms.AES(key(header[len(MAGIC):len(MAGIC)+16])), modes.GCM(header[-12:], tag)).decryptor()
            operation.authenticate_additional_data(header)
            while remaining > 0:
                chunk = original.read(min(CHUNK, remaining))
                if not chunk:
                    raise ValueError("Truncated backup")
                output.write(operation.update(chunk))
                remaining -= len(chunk)
            output.write(operation.finalize())
        else:
            raise ValueError("Invalid operation")

if __name__ == "__main__":
    try:
        transform(*sys.argv[1:])
    except Exception:
        if len(sys.argv) == 4:
            try:
                os.unlink(sys.argv[3])
            except OSError:
                pass
        print("Backup encryption or authentication failed", file=sys.stderr)
        sys.exit(1)

"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");
const { syncDirectory, writeDurable } = require("./durable-storage");
const RESERVATION_BYTES = 65536;
const fail = (code) => Object.assign(new Error(code), { code });

class GatewaySpoolCapacity {
  constructor({ stateDirectory, maxBytes = 64 * 1024 * 1024, maxCommands = 10000,
    minFreeBytes = 16 * 1024 * 1024, reservationBytes = RESERVATION_BYTES, directoryName = "commands", diskFree = async (directory) => {
      const info = await fs.statfs(directory, { bigint: true });
      return info.bavail * info.bsize;
    } }) {
    if (!path.isAbsolute(stateDirectory || "") || !Number.isSafeInteger(reservationBytes) || reservationBytes < RESERVATION_BYTES ||
      !["commands", "recordings"].includes(directoryName) || !Number.isSafeInteger(maxBytes) || maxBytes < reservationBytes ||
      !Number.isSafeInteger(maxCommands) || maxCommands < 1 || !Number.isSafeInteger(minFreeBytes) || minFreeBytes < 0 ||
      typeof diskFree !== "function") throw fail("IOT_EDGE_STORAGE_CONFIG_INVALID");
    Object.assign(this, { stateDirectory, maxBytes, maxCommands, minFreeBytes, diskFree, reservationBytes, directoryName });
    this.directory = path.join(stateDirectory, directoryName);
  }

  async inspect() {
    let commands = 0, accountedBytes = 0;
    const entries = await fs.opendir(this.directory);
    for await (const entry of entries) {
      if (!entry.isDirectory() || !/^[a-f0-9]{64}$/.test(entry.name)) throw fail("IOT_EDGE_STORAGE_REQUIRES_RECONCILIATION");
      let bytes = 0, delivered = false;
      const files = await fs.opendir(path.join(this.directory, entry.name));
      for await (const file of files) {
        const info = await fs.lstat(path.join(this.directory, entry.name, file.name));
        if (!info.isFile() || info.isSymbolicLink()) throw fail("IOT_EDGE_STORAGE_REQUIRES_RECONCILIATION");
        bytes += info.size;
        if (this.directoryName === "recordings" && file.name === "delivery.json" && info.size <= 16384) {
          try { delivered = JSON.parse(await fs.readFile(path.join(this.directory, entry.name, file.name), "utf8")).status === "AVAILABLE"; }
          catch { /* A corrupt receipt never releases its reservation. */ }
        }
      }
      commands++;
      // Reserve future result/receipt writes even if execution or upload is pending.
      accountedBytes += delivered ? bytes : Math.max(bytes, this.reservationBytes);
      if (!Number.isSafeInteger(accountedBytes)) throw fail("IOT_EDGE_STORAGE_FULL");
    }
    return { commands, accountedBytes };
  }

  async claim(key) {
    if (!/^[a-f0-9]{64}$/.test(key)) throw fail("IOT_EDGE_STORAGE_CONFIG_INVALID");
    const root = await fs.lstat(this.stateDirectory);
    if (!root.isDirectory() || root.isSymbolicLink()) throw fail("IOT_EDGE_STORAGE_REQUIRES_RECONCILIATION");
    await fs.mkdir(this.directory, { recursive: true, mode: 0o700 });
    const info = await fs.lstat(this.directory);
    if (!info.isDirectory() || info.isSymbolicLink()) throw fail("IOT_EDGE_STORAGE_REQUIRES_RECONCILIATION");
    await syncDirectory(this.stateDirectory);
    const target = path.join(this.directory, key);
    try {
      const existing = await fs.lstat(target);
      if (!existing.isDirectory() || existing.isSymbolicLink()) throw fail("IOT_EDGE_STORAGE_REQUIRES_RECONCILIATION");
      return false; // Replay must remain available even when no new commands fit.
    } catch (failure) { if (failure.code !== "ENOENT") throw failure; }
    const lockFile = path.join(this.stateDirectory, `${this.directoryName === "commands" ? "command" : "recording"}-admission.lock`);
    let lock;
    try { lock = await fs.open(lockFile, "wx", 0o600); }
    catch (failure) { if (failure.code === "EEXIST") throw fail("IOT_EDGE_STORAGE_BUSY"); throw failure; }
    try {
      await lock.writeFile(JSON.stringify({ pid: process.pid })); await lock.sync();
      await syncDirectory(this.stateDirectory);
      try {
        const existing = await fs.lstat(target);
        if (!existing.isDirectory() || existing.isSymbolicLink()) throw fail("IOT_EDGE_STORAGE_REQUIRES_RECONCILIATION");
        return false;
      } catch (failure) { if (failure.code !== "ENOENT") throw failure; }
      const usage = await this.inspect();
      if (usage.commands >= this.maxCommands || usage.accountedBytes + this.reservationBytes > this.maxBytes ||
        BigInt(await this.diskFree(this.stateDirectory)) < BigInt(this.minFreeBytes) + BigInt(this.reservationBytes))
        throw fail("IOT_EDGE_STORAGE_FULL");
      await fs.mkdir(target, { mode: 0o700 });
      await syncDirectory(this.directory);
      await writeDurable(path.join(target, "reservation.json"), { bytes: this.reservationBytes });
      return true;
    } finally {
      await lock.close();
      await fs.unlink(lockFile);
      await syncDirectory(this.stateDirectory);
    }
  }

  async health(configurationVersion) {
    if (this.directoryName !== "commands" || !Number.isSafeInteger(configurationVersion) || configurationVersion < 1) throw fail("IOT_EDGE_STORAGE_CONFIG_INVALID");
    const root = await fs.lstat(this.stateDirectory);
    if (!root.isDirectory() || root.isSymbolicLink()) throw fail("IOT_EDGE_STORAGE_REQUIRES_RECONCILIATION");
    let exists = true;
    try {
      const directory = await fs.lstat(this.directory);
      if (!directory.isDirectory() || directory.isSymbolicLink()) throw fail("IOT_EDGE_STORAGE_REQUIRES_RECONCILIATION");
    } catch (error) { if (error.code !== "ENOENT") throw error; exists = false; }
    const usage = exists ? await this.inspect() : { commands: 0, accountedBytes: 0 };
    const free = BigInt(await this.diskFree(this.stateDirectory));
    return { configurationVersion, spoolCommandCount: usage.commands, spoolAccountedBytes: usage.accountedBytes, spoolCapacityBytes: this.maxBytes,
      storageBlocked: usage.commands >= this.maxCommands || usage.accountedBytes + this.reservationBytes > this.maxBytes ||
        free < BigInt(this.minFreeBytes) + BigInt(this.reservationBytes) };
  }
}
module.exports = { GatewaySpoolCapacity, RESERVATION_BYTES };

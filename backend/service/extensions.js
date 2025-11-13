const path = require("path");

const checkExtension = {
  confirmExtension(req) {
    if (!req) return false;

    const files = [];

    if (req.file) files.push(req.file);

    if (Array.isArray(req.files)) {
      files.push(...req.files);
    } else if (req.files && typeof req.files === "object") {
      for (const key of Object.keys(req.files)) {
        const item = req.files[key];
        if (Array.isArray(item)) files.push(...item);
        else files.push(item);
      }
    }

    if (files.length === 0) return true; // no files -> valid

    const allowedExt = new Set([".jpg", ".jpeg", ".gif", ".png"]);

    return files.every((file) => {
      const name =
        file.originalname || file.name || file.filename || file.path || "";
      const mimetype = (file.type || "").toLowerCase();
      const ext = (path.extname(name) || "").toLowerCase();

      const extOk = allowedExt.has(ext);
      const mimeOk = mimetype ? mimetype.startsWith("image/") : true;

      return extOk && mimeOk;
    });
  },
};

module.exports = checkExtension;

"use strict";
const { Schema, model } = require("mongoose");
module.exports = model("PlatformControl", new Schema({ key: { type: String, unique: true }, revision: { type: Number, default: 0 } }));

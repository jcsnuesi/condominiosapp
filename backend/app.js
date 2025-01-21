"use strict";

const express = require("express");
var cors = require("cors");
var bodyparser = require("body-parser");
var morgan = require("morgan");
const app = express();

//Cargar rutas de archivos
var user_routes = require("./routes/users");
var property_routes = require("./routes/property");
var task_routes = require("./routes/task");
var guest_routes = require("./routes/guest");
var reserve_routes = require("./routes/reserves");
var docs_routes = require("./routes/docs");
var cxc_routes = require("./routes/cxc");
var invoice_routes = require("./routes/invoice");
var personnel_routes = require("./routes/personnel");
var condominio_routes = require("./routes/condominio");
var staff_routes = require("./routes/staff");
var owner = require("./routes/owner");
var super_user = require("./routes/super_user");
const family_routes = require("./routes/family");

//Middlewares
app.use(morgan("dev"));
app.use(cors("*"));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use("/api", user_routes);
app.use("/api", property_routes);
app.use("/api", task_routes);
app.use("/api", guest_routes);
app.use("/api", reserve_routes);
app.use("/api", docs_routes);
app.use("/api", cxc_routes);
app.use("/api", invoice_routes);
app.use("/api", staff_routes);
app.use("/api", personnel_routes);
app.use("/api", condominio_routes);
app.use("/api", owner);
app.use("/api", super_user);
app.use("/api", family_routes);

module.exports = app;

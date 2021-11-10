"use strict";
require("dotenv").config();
const path = require("path");
const fileUpload = require("express-fileupload");
const express = require("express");
const app = express();
const port = process.env.PORT || 3005;
const mongoDB = require("./mongoDB");

//middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
// app.use(express.json());

const YAML = require('yamljs')
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// const swaggerOption = require("./swagger.js");
const swaggerOption = YAML.load('api.yml');
const swaggerDoc = swaggerJsDoc(swaggerOption);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));


app.use(require("./routes/loginRoute"));
app.use(require("./routes/fileUploadRoute"));
app.use(require("./routes/imgRoute"));
app.use(require("./routes/lineBotCallback"));
app.use(require("./routes/msgRoute"));

app.use(require("./routes/defaultRoute")); //必須擺最後

mongoDB.connect();

app.listen(port, () => {
  console.log(`line-bot-dopee listening on ${port}`);
});

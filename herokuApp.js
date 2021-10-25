"use strict";

const express = require("express");
const mongoose = require("mongoose");

const imgRoute = require("./routes/imgRoute");
const msgRoute = require("./routes/msgRoute");
const lineServiceRoute = require("./routes/lineBotCallback");

const dbUri =
  "mongodb+srv://lien0103:k1319900103@chatroom.f2mhj.mongodb.net/line?retryWrites=true&w=majority";

const app = express();
const port = process.env.PORT || 3005;


app.use(imgRoute);
app.use(lineServiceRoute);
app.use(msgRoute);

mongoose
  .connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("connected to DB");
    app.listen(port, () => {
      console.log(`line-bot-dopee listening on ${port}`);
    });
  });

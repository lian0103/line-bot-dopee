"use strict";
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dbUri =
  "mongodb+srv://lien0103:a12345678@chatroom.f2mhj.mongodb.net/line?retryWrites=true&w=majority";
const app = express();
const port = process.env.PORT || 3005;

app.use(express.static(path.join(__dirname, "public")));
app.use(require("./routes/imgRoute"));
app.use(require("./routes/lineBotCallback"));
app.use(require("./routes/msgRoute"));
app.use(require("./routes/defaultRoute"));

mongoose
  .connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to DB");
    app.listen(port, () => {
      console.log(`line-bot-dopee listening on ${port}`);
    });
  });

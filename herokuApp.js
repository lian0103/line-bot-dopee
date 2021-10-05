"use strict";

const line = require("@line/bot-sdk");
const express = require("express");
const mongoose = require("mongoose");
const dbUri =
  "mongodb+srv://lien0103:k1319900103@chatroom.f2mhj.mongodb.net/chatroom?retryWrites=true&w=majority";
// create LINE SDK config from env variables
const config = {
  channelAccessToken:
    "Rm5mYr5hK4pwHHtD/k4tAvfCr2sScjseVX5JJLmeOXDmUB6GNtT6LQ4kjNzh2uduvrDXmU4EP1GPWu05IfzzFb1bsMiu7M9/UXjJ+vr/x4XoBbfSbjzRCLmhzjerjrpDzQz6Q1Qn2GECfsWEH+oRvwdB04t89/1O/w1cDnyilFU=",
  channelSecret: "c6f6783677fabd99028063fff9f7cf81",
};
const client = new line.Client(config);
const app = express();
const port = process.env.PORT || 3005;

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post("/callback", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// event handler
const linebotModel = require("./models/linebotModel");
async function handleEvent(event) {
  console.log(event);
  const replyTemplate = [
    "我是豆皮! 6個月大時...成為了太監",
    "給我罐罐!!",
    "我要按摩",
    "給我小強!",
    "系統還在優化中...請斗內",
    "不用上班逆?",
  ];
  const profile = (await client.getProfile(event.source.userId)) || {};
  const replyMsg = `Hi! ${profile.displayName} ${
    replyTemplate[getRandom(0, replyTemplate.length - 1)]
  }`;
  const echo = { type: "text", text: replyMsg };

  let doc = new linebotModel({
    name: profile.displayName,
    msg: event.message.text,
  });
  await doc.save();

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

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

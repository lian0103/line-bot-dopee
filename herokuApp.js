"use strict";
const path = require("path");
const line = require("@line/bot-sdk");
const express = require("express");
const mongoose = require("mongoose");
const herokuURL = "https://line-bot-doope.herokuapp.com";
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

app.get("/images/:name", (req, res, next) => {
  var options = {
    root: path.join(__dirname, "public"),
    dotfiles: "deny",
    headers: {
      "content-type":"jpeg",
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };
  var fileName = req.params.name + ".jpg";
  console.log("fileName",fileName)
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// event handler
const linebotModel = require("./models/linebotModel");
var nameCache = [];
async function handleEvent(event) {
  console.log(event);

  if (event.message.text.includes("豆皮")) {
    let imgURL = herokuURL + `/images/dopee${getRandom(1, 3)}`;
    let imageMsg = {
      type: "image",
      originalContentUrl: imgURL,
      previewImageUrl: imgURL,
    };
    return client.replyMessage(event.replyToken, imageMsg);
  }

  const replyTemplate = [
    "黃阿瑪有後宮... 我沒有",
    "你是帥哥 還是美女??",
    "給我罐罐!!",
    "我要按摩",
    "給我小強!",
    "系統還在優化中...請斗內",
    "不用上班嗎? 在家耍廢嗎? ",
    "你是不是上班都在看D-card西斯?",
  ];
  const profile = (await client.getProfile(event.source.userId)) || {};
  let replyMsg = "";
  if (!nameCache.includes(profile.displayName)) {
    nameCache.push(profile.displayName);
    replyMsg += `Hi! ${profile.displayName} 我是豆皮! 6個月大時成為太監!  輸入關鍵字「豆皮」會有驚喜美圖 ^.^ `;
  } else {
    replyMsg += `${replyTemplate[getRandom(0, replyTemplate.length - 1)]}`;
  }

  const echo = { type: "text", text: replyMsg };
  if (event.type == "message" || event.message.type == "text") {
    let doc = new linebotModel({
      name: profile.displayName,
      msg: event.message.text || event.message.stickerId || "null",
    });
    await doc.save();
  }

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

"use strict";
const path = require("path");
const line = require("@line/bot-sdk");
const express = require("express");
const mongoose = require("mongoose");
const request = require("request");
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

// register a webhook handler with middleware ; about the middleware, please refer to doc
app.post("/callback", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleMsgReply))
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
      "content-type": "jpeg",
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };
  var fileName = req.params.name + ".jpg";

  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

app.get("/broadcastAll", (req, res, next) => {

  console.log(req.params)
  console.log(req.params.msg)

  if(req.params.msg && req.params.msg != ""){
    let reqOption = {
      url: "https://api.line.me/v2/bot/message/broadcast",
      uri: "https://api.line.me/v2/bot/message/broadcast",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.channelAccessToken}`,
      },
      body: JSON.stringify({
        messages: [
          {
            type: "text",
            text: "廣播測試~",
          },
          {
            type: "text",
            text: "呵~~~",
          },
        ],
      }),
    };
    request.post(reqOption, (error, result, body) => {
      console.log(result);
      res.json(result);
    });
  }else{
    res.json({msg:"需要msg內容"})
  }

});

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// event handler
const linebotModel = require("./models/linebotModel");
var nameCache = [];
async function handleMsgReply(event) {
  console.log(event);

  const replyTemplate = [
    "我今年一歲",
    "黃阿瑪有後宮... 我沒有",
    "你是帥哥 還是美女??",
    "給我罐罐!!",
    "我要按摩",
    "給我小強!",
    "系統還在優化中...請斗內",
    "不用上班嗎? 在家耍廢嗎? ",
    "累~~~",
    "思考貓生...",
  ];
  const profile = (await client.getProfile(event.source.userId)) || {};
  let replyMsg = "";
  let replyImg = null;
  if (!nameCache.includes(profile.displayName)) {
    nameCache.push(profile.displayName);
    replyMsg += `Hi! ${profile.displayName} 我是豆皮! 6個月大時成為太監! ^.^ `;
    replyImg = {
      type: "image",
      originalContentUrl: herokuURL + "/images/dopee0 ",
      previewImageUrl: herokuURL + "/images/dopee0 ",
    };
  } else {
    if (event.message.text?.includes("豆皮")) {
      let imgURL = herokuURL + `/images/dopee${getRandom(1, 3)}`;
      replyImg = {
        type: "image",
        originalContentUrl: imgURL,
        previewImageUrl: imgURL,
      };
    }
    replyMsg += `${replyTemplate[getRandom(0, replyTemplate.length - 1)]}`;
  }

  if (event.type == "message" || event.message.type == "text") {
    let doc = new linebotModel({
      name: profile.displayName,
      msg: event.message.text || event.message.stickerId || "null",
    });
    await doc.save();
  }

  const echo = replyImg
    ? [{ type: "text", text: replyMsg }, replyImg]
    : { type: "text", text: replyMsg };

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

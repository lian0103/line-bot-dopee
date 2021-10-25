const request = require("request");
const line = require("@line/bot-sdk");
const linebotModel = require("../models/linebotModel");
const config = require("../lineConfig");
const client = new line.Client(config);
const herokuURL = "https://line-bot-doope.herokuapp.com";

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// event handler
var nameCache = [];
async function handleMsgReply(event) {
  // console.log(event);

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
    if (event.message.text.includes("豆皮")) {
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

module.exports.getTodayMsg = async (req, res) => {
  let today = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  let query = linebotModel.find({ updated: { $gte: today } });

  query.then((result) => {
    return res.status(200).json(result);
  });
};

module.exports.broadcastAll = async (req, res) => {
  if (req.query.msg && req.query.msg != "") {
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
            text: req.query.msg,
          },
        ],
      }),
    };
    request.post(reqOption, (error, result, body) => {
      // console.log(result);
      res.json(result);
    });
  } else {
    res.json({ msg: "需要msg內容" });
  }
};

module.exports.handleLineCallback = async (req, res) => {
  Promise.all(req.body.events.map(handleMsgReply))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};

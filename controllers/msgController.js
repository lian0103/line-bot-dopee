const request = require("request");
const line = require("@line/bot-sdk");
const linebotModel = require("../models/linebotModel");
const config = require("../lineConfig");
const client = new line.Client(config);
const herokuURL = "https://line-bot-doope.herokuapp.com";

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

const dirtyWords = ["fuck", "王八", "白癡", "幹"];

var nameCache = [];

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// event handler
async function handleMsgReply(event) {
  let replyMsg = "";
  let replyImg = null;

  if (
    event.message.text &&
    dirtyWords.filter((dWord) => event.message.text.includes(dWord.toLocaleLowerCase())).length > 0
  ) {
    replyMsg += "請勿說髒話字^^";

    return client.replyMessage(event.replyToken, {
      type: "text",
      text: replyMsg,
    });
  }

  const profile = (await client.getProfile(event.source.userId)) || {};

  if (!nameCache.includes(profile.displayName)) {
    nameCache.push(profile.displayName);
    replyMsg += `Hi! ${profile.displayName} 我是豆皮! 6個月大時成為太監! ^.^ `;
    replyImg = {
      type: "image",
      originalContentUrl: herokuURL + "/images/dopee0 ",
      previewImageUrl: herokuURL + "/images/dopee0 ",
    };
  } else {
    if (event.message.text && event.message.text.includes("豆皮")) {
      let imgURL = herokuURL + `/images/dopee${getRandom(1, 3)}`;
      replyImg = {
        type: "image",
        originalContentUrl: imgURL,
        previewImageUrl: imgURL,
      };
    }
    replyMsg += `${replyTemplate[getRandom(0, replyTemplate.length - 1)]}`;
  }
  // console.log("~~~~~~~~~~~~~~~~~~~~~~");
  // console.log(event.type);
  // console.log(event.message);
  // console.log("~~~~~~~~~~~~~~~~~~~~~~");
  if (event.message.text) {
    let doc = new linebotModel({
      name: profile.displayName,
      msg: event.message.text,
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
  let { psw, msg } = req.params;
  // console.log(psw,msg)
  if (psw != "28") {
    return res.json({ status: 302, msg: "密碼錯誤^^" });
  }

  if (msg && msg != "") {
    let reqOption = {
      url: "https://api.line.me/v2/bot/message/broadcast",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.channelAccessToken}`,
      },
      body: JSON.stringify({
        messages: [
          {
            type: "text",
            text: msg,
          },
        ],
      }),
    };
    request.post(reqOption, (error, result, body) => {
      // console.log(result);
      res.json(result);
    });
  } else {
    res.json({ status: 301, msg: "error!" });
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

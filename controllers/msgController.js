const request = require('request');
const line = require('@line/bot-sdk');
const linebotModel = require('../models/linebotModel');
const msgBrocastModel = require('../models/msgBrocastModel');
const { queryFromToStation } = require('../services/trainCheck');
const { getActivitiesByDistrict } = require('../services/tourActivity');
const config = require('../lineConfig');
const client = new line.Client(config);
const herokuURL = 'https://line-bot-doope.herokuapp.com';
const moment = require('moment');

const replyTemplate = [
  '唉呦~',
  '我最近開始玩魔力寶貝歸來~~',
  '我今年一歲',
  '黃阿瑪有後宮... 我沒有',
  '你是帥哥 還是美女??',
  '給我罐罐!!',
  '我要按摩',
  '給我小強!',
  '系統還在優化中...請斗內',
  '不用上班嗎? 在家耍廢嗎? ',
  '累~~~',
  '思考貓生...',
];

const dirtyWords = ['fuck', '王八', '白癡', '幹'];

var nameCache = [];
var recordCache = {};

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// event handler
async function handleMsgReply(event) {
  let replyMsg = '';
  let replyImg = null;
  console.log(event);

  if (
    event.message.text &&
    dirtyWords.filter((dWord) =>
      event.message.text.includes(dWord.toLocaleLowerCase())
    ).length > 0
  ) {
    replyMsg += '請勿說髒話字^^';

    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: replyMsg,
    });
  }

  if (event.message.text.includes('火車')) {
    let strArr = event.message.text.split(' ');
    if (strArr[1] && strArr[2]) {
      let resultFilter = await queryFromToStation(strArr[1], strArr[2]);
      let length = 3;
      let replyStr = '';
      if (Array.isArray(resultFilter) && resultFilter.length > 0) {
        replyStr += `最近幾班車次:
`;
        for (let i = 0; i < length; i++) {
          let TrainInfo = resultFilter[i].TrainInfo;
          let StopTimes = resultFilter[i].StopTimes;
          replyStr += `${TrainInfo.TrainTypeName.Zh_tw} ${TrainInfo.TrainNo} ${
            strArr[1]
          }開車時間:${StopTimes[0].ArrivalTime}，抵達${strArr[2]}時間:${
            StopTimes[StopTimes.length - 1].ArrivalTime
          };`;
          replyStr += `
`;
        }
      } else if (Array.isArray(resultFilter) && resultFilter.length == 0) {
        replyStr += '沒車睡公園了!';
      } else if (typeof resultFilter == 'string') {
        replyStr = resultFilter;
      }

      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: replyStr,
      });
    } else {
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: '查詢火車時刻格式:火車 {起站} {終點站}',
      });
    }
  }

  if (event.message.text.includes('活動')) {
    let strArr = event.message.text.split(' ');
    if (strArr[1]) {
      let resultFilter = await getActivitiesByDistrict(strArr[1]);
      resultFilter = resultFilter.slice(0, 2);
      let replyArr = [];
      let replyStr = '';

      if (Array.isArray(resultFilter) && resultFilter.length > 0) {
        replyStr += `${strArr[1]}最近活動有:
`;
        for (let i = 0; i < resultFilter.length; i++) {
          if (!resultFilter[i]) {
            console.log(resultFilter);
            return false;
          }

          let replyStr = '';
          let actItem = resultFilter[i];
          replyStr += `${actItem.ActivityName} 
活動時間:${moment(actItem.StartTime).format('YYYY-MM-DD')}~${moment(
            actItem.EndTime
          ).format('YYYY-MM-DD')}
${actItem.Description}; ${actItem.WebsiteUrl ? actItem.WebsiteUrl : ''}`;
          replyStr += `
`;
          replyArr.push({
            type: 'text',
            text: replyStr,
          });
          if (actItem.Picture.PictureUrl1) {
            replyArr.push({
              type: 'image',
              originalContentUrl: actItem.Picture.PictureUrl1,
              previewImageUrl: actItem.Picture.PictureUrl1,
            });
          }
        }
      } else if (Array.isArray(resultFilter) && resultFilter.length == 0) {
        replyStr = '查無活動 換個縣市~~!';
      } else if (typeof resultFilter == 'string') {
        replyStr = resultFilter;
      }

      return Array.isArray(replyArr) && resultFilter.length > 0
        ? client.replyMessage(event.replyToken, replyArr)
        : client.replyMessage(event.replyToken, {
            type: 'text',
            text: replyStr,
          });
    } else {
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: '查詢縣市活動格式:活動 {縣市名稱}',
      });
    }
  }

  const profile = (await client.getProfile(event.source.userId)) || {};
  const name = profile.displayName;
  if (!nameCache.includes(name)) {
    nameCache.push(name);
    replyMsg += `Hi! ${name} 我是豆皮! 6個月大時成為太監! ^.^ `;
    replyImg = {
      type: 'image',
      originalContentUrl: herokuURL + '/images/dopee0 ',
      previewImageUrl: herokuURL + '/images/dopee0 ',
    };

    recordCache[name] = [...replyTemplate];
  } else {
    if (event.message.text && event.message.text.includes('豆皮')) {
      let imgURL = herokuURL + `/images/dopee${getRandom(1, 3)}`;
      replyImg = {
        type: 'image',
        originalContentUrl: imgURL,
        previewImageUrl: imgURL,
      };
    }
    if (recordCache[name].length > 0) {
      let rMsgIndex = getRandom(0, recordCache[name].length - 1);
      replyMsg += `${recordCache[name][rMsgIndex]}`;
      recordCache[name].splice(rMsgIndex, 1);
      // console.log(recordCache[name]);
    } else {
      replyMsg += '今日已無話可說^.^';
    }
  }
  if (event.message.text) {
    let doc = new linebotModel({
      name: profile.displayName,
      msg: event.message.text,
    });
    await doc.save();
  }

  const echo = replyImg
    ? [{ type: 'text', text: replyMsg }, replyImg]
    : { type: 'text', text: replyMsg };

  return client.replyMessage(event.replyToken, echo);
}

module.exports.getTodayMsg = async (req, res) => {
  let today = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  let query = linebotModel.find({ updated: { $gte: today } });

  query.then((result) => {
    return res.status(200).json(result);
  });
};

module.exports.getAllMsg = async (req, res) => {
  let query = linebotModel.find();

  query.then((result) => {
    return res.status(200).json(result);
  });
};

module.exports.getBroadcast = (req, res) => {
  let query = msgBrocastModel.find();

  query.then((result) => {
    return res.status(200).json(result);
  });
};

module.exports.broadcast = async (req, res) => {
  let { msg, img } = req.body || {};
  // console.log(req)
  console.log(msg, img);

  if (msg && msg != '') {
    let body = img
      ? {
          messages: [
            {
              type: 'text',
              text: msg,
            },
            {
              type: 'image',
              originalContentUrl: herokuURL + `/upload/${img}`,
              previewImageUrl: herokuURL + `/upload/${img}`,
            },
          ],
        }
      : {
          messages: [
            {
              type: 'text',
              text: msg,
            },
          ],
        };

    let reqOption = {
      url: 'https://api.line.me/v2/bot/message/broadcast',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.channelAccessToken}`,
      },
      body: JSON.stringify(body),
    };
    request.post(reqOption, async (error, result, body) => {
      // console.log(result);
      let doc = new msgBrocastModel({
        msg,
        img: img ? img : '',
      });
      await doc.save();

      res.json(result);
    });
  } else {
    res.json({ status: 301, msg: 'broadcast error!', body: req.body });
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

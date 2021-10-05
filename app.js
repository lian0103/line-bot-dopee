var linebot = require("linebot");

// 用於辨識Line Channel的資訊
var bot = linebot({
  channelId: "1656497673",
  channelSecret: "c6f6783677fabd99028063fff9f7cf81",
  channelAccessToken: "Rm5mYr5hK4pwHHtD/k4tAvfCr2sScjseVX5JJLmeOXDmUB6GNtT6LQ4kjNzh2uduvrDXmU4EP1GPWu05IfzzFb1bsMiu7M9/UXjJ+vr/x4XoBbfSbjzRCLmhzjerjrpDzQz6Q1Qn2GECfsWEH+oRvwdB04t89/1O/w1cDnyilFU=",
});

console.log(bot);

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 當有人傳送訊息給Bot時
bot.on("message", async function (event) {
  const replyTemplate = ["我是豆皮! 6個月時大成為太監", "給我罐罐!!", "我要按摩","給我小強!"];
  let profile = await event.source.profile();
//   console.log(profile);
  var replyMsg = `Hi! ${profile.displayName} ${replyTemplate[getRandom(0, replyTemplate.length-1)]}`;
  event
    .reply(replyMsg)
    .then(function (data) {
      // 當訊息成功回傳後的處理
    })
    .catch(function (error) {
      // 當訊息回傳失敗後的處理
    });
});

// Bot所監聽的webhook路徑與port
bot.listen("/linewebhook", 3005, function () {
  console.log("[BOT已準備就緒]");
});

const gtts = require("node-gtts");
const path = require("path");

const textToSpeak = (text, wavFileName = "textToSpeak", lang = "en") => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(process.cwd(), `public/wavs/${wavFileName}.wav`);
    const tts = gtts(lang);
    tts.speed = 1.2;
    tts.save(filepath, text, function () {
      console.log("save done");
      resolve(true);
    });
  }).catch(err => {
    reject();
  });
};

module.exports = {
  textToSpeak
};

// test
// const textSpeech = "私は今日とても忙しいです。";
// textToSpeak(textSpeech, "textToSpeak", "en");

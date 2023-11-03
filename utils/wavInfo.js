const fs = require("fs");
const wav = require("wav");
const path = require("path");

// not work
const getWavSeconds = filePath => {
  const file = fs.createReadStream(filePath);
  const reader = new wav.Reader();

  file.pipe(reader);

  reader.on("format", function (format) {
    const sampleRate = format.sampleRate;
    const channels = format.channels;
    const bitsPerSample = format.bitDepth;

    // 计算WAV文件的长度（以秒为单位）
    const lengthInSeconds = reader.dataChunk.length / (sampleRate * channels * (bitsPerSample / 8));

    console.log(`WAV文件长度：${lengthInSeconds} 秒`);
    return lengthInSeconds;
  });
};

module.exports = {
  getWavSeconds
};

//test
const wavFilepath = path.join(process.cwd(), `public/wavs/textToSpeak.wav`);
getWavSeconds(wavFilepath);

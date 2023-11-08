const https = require("https");
const fetch = require("node-fetch-commonjs");
const dotenv = require("dotenv");

dotenv.config();

const url = "https://api.openai.com/v1/images/generations";

const customHeaders = {
  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // 添加自定义标头
  "Content-Type": "application/json"
};

const fetchOpenAiImage = async requestMsg => {
  if (!requestMsg) return false;

  const requestData = {
    model: "dall-e-3",
    prompt: requestMsg,
    n: 1,
    size: "1024x1024"
  };
  return await fetch(url, {
    method: "POST",
    headers: customHeaders,
    agent: new https.Agent({ rejectUnauthorized: false }),
    body: JSON.stringify(requestData)
  })
    .then(async response => {
      return response.arrayBuffer();
    })
    .then(Uint8Contents => {
      // console.log(Uint8Contents);
      const textDecoder = new TextDecoder("utf-8");
      const jsonString = textDecoder.decode(Uint8Contents);
      const jsonObject = JSON.parse(jsonString);
      // console.log(jsonObject);
      // console.log(jsonObject.data[0].url);
      return jsonObject.data[0];
    })
    .catch(err => {
      console.error("fetchOpenAiImage error", err);
    });
};

module.exports = {
  fetchOpenAiImage
};

// test
// async function runTest() {
//   let res = await fetchOpenAiImage("崩潰的工程師 趴著");
//   console.log(res);
// }
// runTest();

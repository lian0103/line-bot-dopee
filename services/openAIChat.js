const https = require('https');
const fetch = require('node-fetch-commonjs');
const dotenv = require('dotenv');

dotenv.config();

const url = 'https://api.openai.com/v1/chat/completions';

const customHeaders = {
  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // 添加自定义标头
  'Content-Type': 'application/json',
};

const fetchOpenAiChat = async (requestMsg) => {
  if (!requestMsg) return false;

  const requestData = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: requestMsg }],
    temperature: 0.7,
  };
  return await fetch(url, {
    method: 'POST',
    headers: customHeaders,
    agent: new https.Agent({ rejectUnauthorized: false }),
    body: JSON.stringify(requestData),
  })
    .then(async (response) => {
      return response.arrayBuffer();
    })
    .then((Uint8Contents) => {
      // console.log(Uint8Contents);
      const textDecoder = new TextDecoder('utf-8');
      const jsonString = textDecoder.decode(Uint8Contents);
      const jsonObject = JSON.parse(jsonString);
      // console.log(jsonObject);
      // console.log(jsonObject.choices[0].message);
      return jsonObject.choices[0].message;
    })
    .catch(() => {
      console.error('fetchOpenAiChat error');
    });
};

module.exports = {
  fetchOpenAiChat,
};

// test
// async function runTest() {
//   let res = await fetchOpenAiChat('翻譯英文 你好嗎？');
//   console.log(res);
// }
// runTest();

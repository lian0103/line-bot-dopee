'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: "Rm5mYr5hK4pwHHtD/k4tAvfCr2sScjseVX5JJLmeOXDmUB6GNtT6LQ4kjNzh2uduvrDXmU4EP1GPWu05IfzzFb1bsMiu7M9/UXjJ+vr/x4XoBbfSbjzRCLmhzjerjrpDzQz6Q1Qn2GECfsWEH+oRvwdB04t89/1O/w1cDnyilFU=",
  channelSecret: "c6f6783677fabd99028063fff9f7cf81",
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

// event handler
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const replyTemplate = ["我是豆皮! 6個月時大成為太監", "給我罐罐!!", "我要按摩","給我小強!"];
  let profile = await event.source.profile();
//   console.log(profile);
  var replyMsg = `Hi! ${profile.displayName} ${replyTemplate[getRandom(0, replyTemplate.length-1)]}`;
  const echo = { type: 'text', replyMsg };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`line-bot-dopee listening on ${port}`);
});
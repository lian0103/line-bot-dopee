require("dotenv").config();

const lineConfig = {
  channelAccessToken:process.env.Channel_Access_Token,
  channelSecret: process.env.Channel_Secret,
};

module.exports = lineConfig;

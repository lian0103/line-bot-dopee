// const lineConfig = {
//   channelAccessToken:
//     "Rm5mYr5hK4pwHHtD/k4tAvfCr2sScjseVX5JJLmeOXDmUB6GNtT6LQ4kjNzh2uduvrDXmU4EP1GPWu05IfzzFb1bsMiu7M9/UXjJ+vr/x4XoBbfSbjzRCLmhzjerjrpDzQz6Q1Qn2GECfsWEH+oRvwdB04t89/1O/w1cDnyilFU=",
//   channelSecret: "c6f6783677fabd99028063fff9f7cf81",
// };

const lineConfig = {
  channelAccessToken:process.env.Channel_Access_Token,
  channelSecret: process.env.Channel_Secret,
};

module.exports = lineConfig;

const request = require('request');
const moment = require('moment');
const { getAuthorizationHeader, domain } = require('./PTX_API_Config');

const districtNameAliasMap = {
  台北: '臺北',
  台中: '臺中',
  台東: '臺東',
  台南: '臺南',
  馬祖: '連江',
};

const queryTourismActivity = () => {
  return new Promise((resolv, reject) => {
    let url = domain + '/v2/Tourism/Activity?$format=JSON';
    let options = {
      url,
      headers: getAuthorizationHeader(),
    };
    request.get(options, (err, res, body) => {
      if (err) {
        console.error(err);
      }
      let activities = JSON.parse(res.body);
      // console.log(activities);
      resolv(activities);
    });
  });
};

const getActivitiesByDistrict = (districStr = '新北市') => {
  return new Promise(async (resolv, reject) => {
    districStr = districtNameAliasMap[districStr]
      ? districtNameAliasMap[districStr]
      : districStr;
    if (!districStr) {
      resolv(`輸入的${districStr}可能不是正確縣市名稱喔`);
    }

    let activities = await queryTourismActivity();
    let result = activities
      .filter((obj) => obj.Location && obj.Location.includes(districStr))
      .filter((obj) => {
        let bool = moment(obj.EndTime).isAfter(moment(), 'day');
        // console.log(obj.EndTime, bool);
        return bool;
      });
    // console.log(result);

    resolv(result);
  });
};

module.exports = {
  getActivitiesByDistrict,
};

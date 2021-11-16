const request = require("request");
const jsSHA = require("jssha");
const moment = require("moment");

const domain = "https://ptx.transportdata.tw/MOTC";

//appID appKey要等平台回復 2021-11-16申請
const getAuthorizationHeader = function () {
  var AppID = "78ca5089aa8846a4ab4d187430b9b2cc";
  var AppKey = "WqZfckeqVOmy2-5M4AYoSDPNJj8";

  var GMTString = new Date().toGMTString();
  var ShaObj = new jsSHA("SHA-1", "TEXT");
  ShaObj.setHMACKey(AppKey, "TEXT");
  ShaObj.update("x-date: " + GMTString);
  var HMAC = ShaObj.getHMAC("B64");
  var Authorization =
    'hmac username="' +
    AppID +
    '", algorithm="hmac-sha1", headers="x-date", signature="' +
    HMAC +
    '"';

  return { Authorization: Authorization, "X-Date": GMTString };
};

var stationInfoList = null;

const queryAllSationInfo = () => {
  return new Promise((resolv, reject) => {
    let url = domain + "/v3/Rail/TRA/Station?$format=JSON";
    let options = {
      url,
      headers: getAuthorizationHeader(),
    };
    request.get(options, (err, res, body) => {
      if (err) {
        console.error(err);
      }
      stationInfoList = JSON.parse(res.body).Stations.map((obj) => {
        return {
          ...obj,
          ...obj.StationName,
        };
      });
      // console.log(stationInfoList);
      resolv(true);
    });
  });
};

const queryFromToStation = (from = "鶯歌", to = "臺北", today = true) => {
  return new Promise(async (resolv, reject) => {
    await queryAllSationInfo();
    let TrainDate = today
      ? moment().format("YYYY-MM-DD")
      : moment(today).format("YYYY-MM-DD");
    let fromId = stationInfoList.filter((obj) => obj.Zh_tw == from)[0]
      ? stationInfoList.filter((obj) => obj.Zh_tw == from)[0].StationID
      : null;
    let toId = stationInfoList.filter((obj) => obj.Zh_tw == to)[0]
      ? stationInfoList.filter((obj) => obj.Zh_tw == to)[0].StationID
      : null;
    if (!fromId || !toId) {
      console.log("in~~?");
      return "車站站名有誤";
    }

    let url =
      domain +
      `/v3/Rail/TRA/DailyTrainTimetable/OD/Inclusive/${fromId}/to/${toId}/${TrainDate}`;
    let options = {
      url,
      headers: getAuthorizationHeader(),
    };
    request.get(options, (err, res, body) => {
      if (err) {
        console.error(err);
      }
      let result = JSON.parse(res.body);
      // console.log(result);
      result = result.TrainTimetables.filter((obj) => {
        console.log(
          moment(TrainDate + " " + obj.StopTimes[0].ArrivalTime + ":00")
        );
        let isAfter = moment(
          TrainDate + " " + obj.StopTimes[0].ArrivalTime + ":00"
        ).isAfter();
        return isAfter;
      });
      resolv(result);
    });
  });
};

// queryFromToStation();

module.exports = {
  queryFromToStation,
};

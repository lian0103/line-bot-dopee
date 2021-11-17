const request = require("request");
const jsSHA = require("jssha");
const moment = require("moment");

const domain = "https://ptx.transportdata.tw/MOTC";
const PTXconfig = {
  AppID: "78ca5089aa8846a4ab4d187430b9b2cc",
  AppKey: "WqZfckeqVOmy2-5M4AYoSDPNJj8",
};

const getAuthorizationHeader = function () {
  var AppID = PTXconfig.AppID;
  var AppKey = PTXconfig.AppKey;

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
      let stationInfoList = JSON.parse(res.body).Stations.map((obj) => {
        return {
          ...obj,
          ...obj.StationName,
        };
      });
      // console.log(stationInfoList);
      resolv(stationInfoList);
    });
  });
};

const queryFromToStation = (from = "鶯歌", to = "山佳", today = true) => {
  return new Promise(async (resolv, reject) => {
    from = from == "台北" ? "臺北" : from;
    to = to == "台北" ? "臺北" : to;
    console.log(from, to);
    queryAllSationInfo().then((stationInfoList) => {
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
        resolv(`輸入的${from}或${to}的站名有誤喔`);
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
        let resultFilter = [];
        result.TrainTimetables.forEach((obj, index) => {
          let timeVal = Date.parse(
            TrainDate + " " + obj.StopTimes[0].ArrivalTime + ":00"
          ).valueOf();
          let curVal = Date.parse(new Date()).valueOf();
          let isAfter = timeVal > curVal;
          // console.log(timeVal, curVal, isAfter);

          if (isAfter && resultFilter.length < 3) {
            resultFilter.push(obj);
          }
        });

        resolv(resultFilter);
      });
    });
  }).catch((err) => {
    console.log(err);
  });
};

module.exports = {
  queryFromToStation,
};

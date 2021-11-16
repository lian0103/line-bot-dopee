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
        console.log("in~~?車站站名有誤");
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
        console.log(result.TrainTimetables.length);
        let resultFilter = [];
        result.TrainTimetables.forEach((obj, index) => {
          let isAfter = moment(
            TrainDate + " " + obj.StopTimes[0].ArrivalTime + ":00"
          ).isAfter(moment(new Date()));

          if (isAfter && resultFilter.length < 3) {
            console.log(typeof isAfter);
            console.log(index, isAfter);
            resultFilter.push(obj);
          }
        });

        console.log(resultFilter.length);
        let strArr = ["", from, to];

        let length = 2;
        let replyStr = "";
        if (resultFilter.length > 0) {
          replyStr += "最近幾班車次:";
          for (let i = 0; i < length; i++) {
            let TrainInfo = resultFilter[i].TrainInfo;
            let StopTimes = resultFilter[i].StopTimes;
            replyStr +=
              TrainInfo.TrainTypeName.Zh_tw +
              TrainInfo.TrainNo +
              " " +
              strArr[1] +
              "開車時間:" +
              StopTimes[0].ArrivalTime +
              "，抵達" +
              strArr[2] +
              ":" +
              StopTimes[StopTimes.length - 1].ArrivalTime +
              ";";
          }
        }
        console.log(replyStr);

        resolv(resultFilter);
      });
    });
  }).catch((err) => {
    console.log(err);
  });
};

//service test
// let test1 = "桃園";
// let test2 = "台北";
// queryFromToStation(test1, test2).then((resulStr) => {
//   console.log(resulStr);
// });

module.exports = {
  queryFromToStation,
};

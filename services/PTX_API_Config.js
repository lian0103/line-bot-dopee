const jsSHA = require("jssha");

const PTXconfig = {
  AppID: "78ca5089aa8846a4ab4d187430b9b2cc",
  AppKey: "WqZfckeqVOmy2-5M4AYoSDPNJj8",
};

const domain = "https://ptx.transportdata.tw/MOTC";

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

module.exports = {
    PTXconfig,
    domain,
    getAuthorizationHeader
}
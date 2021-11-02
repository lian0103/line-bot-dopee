const path = require("path");

module.exports.handleUpload = (req, res, next) => {
  console.log(JSON.stringify(req.file));
  return res.json({ status: 200, imgUploadInfo: req.file });
};

module.exports.handleGetUploadImg = (req, res, next) => {
  var options = {
    root: path.join(process.cwd(), "public", "uploads"),
    dotfiles: "deny",
    headers: {
      "content-type": "image/jpeg",
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };
  var fileName = req.params.name;
  console.log("fileName", fileName);

  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      // console.log("Sent:", fileName);
    }
  });
};

module.exports.handleGetStaticImg = (req, res, next) => {
  var options = {
    root: path.join(process.cwd(), "public", "imgs"),
    dotfiles: "deny",
    headers: {
      "content-type": "jpeg",
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };
  var fileName = req.params.name + ".jpg";

  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      // console.log("Sent:", fileName);
    }
  });
};

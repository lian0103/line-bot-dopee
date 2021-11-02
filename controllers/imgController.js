const path = require("path");
var streamifier = require("streamifier");
var mongoose = require("mongoose");

module.exports.handleFileUploadToMongoDB = (req, res, next) => {
  let filename = req.files.file.name;

  var gridfsbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    chunkSizeBytes: 1024,
    bucketName: "filesBucket",
  });

  streamifier
    .createReadStream(req.files.file.data)
    .pipe(gridfsbucket.openUploadStream(filename))
    .on("error", function (error) {
      console.log(err);
    })
    .on("finish", function () {
      console.log("done!");
      res.status(200).json({
        success: true,
        msg: "File Uploaded successfully..",
        filename: filename,
      });
    });
};

module.exports.handleGetUploadFileFromMongoDB = async (req, res, next) => {
  const filename = req.params.filename;
  console.log("get download " + filename);

  var gridfsbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    chunkSizeBytes: 1024,
    bucketName: "filesBucket",
  });

  await res.setHeader("Content-type", "image/png");
  gridfsbucket
    .openDownloadStreamByName(filename)
    .pipe(res)
    .on("error", function (error) {
      //   console.log("error" + error);
      res.status(200).json({
        msg: error.message,
      });
    })
    .on("finish", function () {
      console.log("in finish");
    });
};

module.exports.handleGetStaticImg = async (req, res, next) => {
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

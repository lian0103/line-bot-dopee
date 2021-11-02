const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
var streamifier = require("streamifier");
var fs = require("fs");
const path = require("path");

router.post("/upload", (req, res) => {
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
});

router.get("/upload/:filename", (req, res) => {
  const filename = req.params.filename;
  console.log("get download " + filename);

  var gridfsbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    chunkSizeBytes: 1024,
    bucketName: "filesBucket",
  });

  gridfsbucket
    .openDownloadStreamByName(filename)
    .pipe(fs.createWriteStream("./public/uploads/" + filename))
    .on("error", function (error) {
    //   console.log("error" + error);
      res.status(200).json({
        msg: error.message,
      });
    })
    .on("finish", function () {
      var options = {
        root: path.join(process.cwd(), "public", "uploads"),
        dotfiles: "deny",
        headers: {
          "content-type": "jpeg",
          "x-timestamp": Date.now(),
          "x-sent": true,
        },
      };
      res.sendFile(filename, options, function (err) {
        if (err) {
          next(err);
        } else {
          // console.log("Sent:", fileName);
        }
      });
    });
});

module.exports = router;

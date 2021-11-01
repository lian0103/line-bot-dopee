const { Router } = require("express");
const path = require("path");
const router = Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public//uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({storage:storage});

router.post("/images/upload",   upload.single('imgFile'), function (req, res, next) {
  console.log("in~~ /uploadImg");
  console.log(JSON.stringify(req.file));
  return res.json({ status: 200 , imgUploadInfo:req.file });
});

router.get("/images/upload/:name", (req, res, next) => {

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
});


router.get("/images/:name", (req, res, next) => {
  // console.log("process.cwd()", process.cwd());
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
});

module.exports = router;

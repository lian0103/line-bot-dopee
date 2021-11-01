const { Router } = require("express");
const path = require("path");
const router = Router();
const multer = require("multer");
const upload = multer({ dest: '../public/uploads/' });

router.post("/images/upload",   upload.single('imgFile'), function (req, res, next) {
  console.log("in~~ /uploadImg");
  console.log(JSON.stringify(req.file));
  return res.json({ status: 200 , imgUploadInfo:req.file });
});

router.get("/images/upload/:name", (req, res, next) => {
  // console.log("process.cwd()", process.cwd());
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

const { Router } = require("express");
const path = require("path");
const router = Router();

router.get("/images/:name", (req, res, next) => {
  console.log("process.cwd()",process.cwd())
  var options = {
    root: path.join(process.cwd(), "public"),
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

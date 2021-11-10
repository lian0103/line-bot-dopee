const { Router } = require("express");
const path = require("path");
const router = Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/demo.html"), (err) => {
    // console.log(err);
  });
});

router.get("*", (req, res) => {
  res.redirect("/");
});

module.exports = router;

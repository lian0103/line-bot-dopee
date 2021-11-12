const { Router } = require("express");
const path = require("path");
const router = Router();
const crawlerController = require('../controllers/crawlerContoller');

router.get("/crawler", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/crawler.html"), (err) => {
    console.log(err);
  });
});

router.get("/pttCrawler",crawlerController.handlePttCrawler)

router.get("/pttCrawler/targetImgs",crawlerController.handlePttCrawlerGetImgs)

module.exports = router;
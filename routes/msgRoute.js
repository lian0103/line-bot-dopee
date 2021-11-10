const { Router } = require("express");

const msgController = require("../controllers/msgController.js");

const router = Router();

router.get("/queryTodayMsgRecord", msgController.getTodayMsg);

router.get("/queryAllMsgRecord", msgController.getAllMsg);

router.post("/broadcastAll", msgController.broadcastAll);

module.exports = router;

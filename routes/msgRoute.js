const { Router } = require("express");

const msgController = require("../controllers/msgController.js");

const router = Router();

router.get("/msgRecordToday", msgController.getTodayMsg);

router.get("/msgRecordAll", msgController.getAllMsg);

router.post("/broadcastAll", msgController.broadcastAll);

module.exports = router;

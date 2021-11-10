const { Router } = require("express");

const msgController = require("../controllers/msgController.js");

const router = Router();

router.get("/msgRecords", msgController.getAllMsg);

router.get("/msgRecords/today", msgController.getTodayMsg);

router.post("/broadcast", msgController.broadcast);

module.exports = router;

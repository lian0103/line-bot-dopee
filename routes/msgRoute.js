const { Router } = require("express");

const msgController = require('../controllers/msgController.js');

const router = Router();

router.get("/queryTodayMsgRecord", msgController.getTodayMsg);

router.post("/broadcastAll/:psw/:msg",msgController.broadcastAll)

router.post("/broadcastAll/:psw/:msg/:img",msgController.broadcastAll)

module.exports = router;
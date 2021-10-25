const { Router } = require("express");

const msgController = require('../controllers/msgController.js');

const router = Router();

router.get("/queryTodayMsgRecord", msgController.getTodayMsg);

router.get("/broadcastAll",msgController.broadcastAll)


module.exports = router;
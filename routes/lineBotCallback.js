const { Router } = require("express");
const line = require("@line/bot-sdk");
const config = require('../lineConfig')
const msgController = require('../controllers/msgController.js');

const router = Router();

router.post("/callback", line.middleware(config),  msgController.handleLineCallback);


module.exports = router;
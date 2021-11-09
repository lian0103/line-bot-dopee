const { Router } = require("express");

const msgController = require('../controllers/msgController.js');

const router = Router();

/**
 * @swagger
 * /queryTodayMsgRecord:
 *  get:
 *    tags:
 *     - message
 *    description: 撈今天收到的訊息
 *    responses:
 *      '200':
 *        description: A successful response
 * 
 */
router.get("/queryTodayMsgRecord", msgController.getTodayMsg);

/**
 * @swagger
 * /broadcastAll/{psw}/{msg}:
 *    post:
 *      tags:
 *       - message
 *      description: 推播訊息
 *    parameters:
 *      - name: psw
 *        in: path
 *        description: 密碼
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *      - name: msg
 *        in: path
 *        description: 訊息
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: Successfully pushed
 */
router.post("/broadcastAll/:psw/:msg",msgController.broadcastAll)

router.post("/broadcastAll/:psw/:msg/:img",msgController.broadcastAll)

module.exports = router;
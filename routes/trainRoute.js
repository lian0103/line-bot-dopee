const { Router } = require("express");
const router = Router();
const trainController = require('../controllers/trainController');

router.get("/trainCheck",trainController.handleQueryFromToStation);


module.exports = router;
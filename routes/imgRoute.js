const { Router } = require("express");
const router = Router();
const imgController = require("../controllers/imgController");

router.get("/images/:name", imgController.handleGetStaticImg);

module.exports = router;

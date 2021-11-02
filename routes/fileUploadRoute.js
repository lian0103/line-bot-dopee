const express = require("express");
const router = express.Router();

const imgController = require("../controllers/imgController");

router.post("/upload", imgController.handleFileUploadToMongoDB);

router.get("/upload/:filename", imgController.handleGetUploadFileFromMongoDB);

module.exports = router;

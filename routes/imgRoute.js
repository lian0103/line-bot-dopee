const { Router } = require("express");
const router = Router();
const upload = require("../middleware/upload");
const imgController = require("../controllers/imgController");

router.post(
  "/images/upload",
  upload.single("imgFile"),
  imgController.handleUpload
);

router.get("/images/upload/:name", imgController.handleGetUploadImg);

router.get("/images/:name", imgController.handleGetStaticImg);

module.exports = router;

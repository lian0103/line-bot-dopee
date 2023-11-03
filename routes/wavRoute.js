const { Router } = require('express');
const router = Router();
const wavController = require('../controllers/wavController');

router.get('/wavs/:name', wavController.handleGetStaticWav);

module.exports = router;

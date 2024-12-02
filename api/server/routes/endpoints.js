const express = require('express');
const router = express.Router();
const endpointController = require('../controllers/EndpointController');
const overrideController = require('../controllers/OverrideController');

router.get('/', endpointController);
router.get('/config/override', overrideController);

module.exports = router;

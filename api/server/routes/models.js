const express = require('express');
const { modelController } = require('../controllers/ModelController');
const { requireJwtAuth } = require('../middleware/');

const router = express.Router();
router.get('/', requireJwtAuth, modelController);

module.exports = router;

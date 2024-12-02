const express = require('express');
const router = express.Router();
const { handlePerplexica } = require('../../app/perplexica');
const requireJwtAuth = require('../middleware/requireJwtAuth');

router.post('/', requireJwtAuth, handlePerplexica);

module.exports = router;

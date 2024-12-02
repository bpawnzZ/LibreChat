const express = require('express');
const router = express.Router();
const perplexicaRoute = require('./perplexica');
const requireJwtAuth = require('../../middleware/requireJwtAuth');
const { Message } = require('../../../models/Message');
const { Conversation } = require('../../../models/Conversation');
const { logger } = require('../../../config');

router.use(requireJwtAuth);

// Perplexica web search route
router.use('/perplexica', perplexicaRoute);

// Search messages and conversations
router.get('/', async function (req, res) {
  try {
    const messages = (await Message.meiliSearch(req.query.q, undefined, true)).hits;
    const titles = (await Conversation.meiliSearch(req.query.q)).hits;
    res.status(200).send({ messages, titles });
  } catch (error) {
    logger.error('[/search] Error while searching messages & conversations', error);
    res.status(500).send({ message: 'Error searching' });
  }
});

module.exports = router;

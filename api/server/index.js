const express = require('express');
const router = express.Router();
const routes = require('./routes');
const { initializeClient } = require('../app/clients');

// Initialize clients
initializeClient();

// Auth
router.use('/auth', routes.auth);
router.use('/oauth', routes.oauth);

// User
router.use('/user', routes.user);
router.use('/keys', routes.keys);

// Config
router.use('/config', routes.config);
router.use('/banner', routes.banner);

// Messages
router.use('/messages', routes.messages);
router.use('/convos', routes.convos);
router.use('/tags', routes.tags);

// Endpoints
router.use('/ask', routes.ask);
router.use('/edit', routes.edit);
router.use('/search', routes.search);

// Files
router.use('/files', routes.files);
router.use('/assistants', routes.assistants);
router.use('/agents', routes.agents);

// Models and plugins
router.use('/models', routes.models);
router.use('/plugins', routes.plugins);

// Misc
router.use('/tokenizer', routes.tokenizer);
router.use('/prompts', routes.prompts);
router.use('/presets', routes.presets);
router.use('/roles', routes.roles);
router.use('/balance', routes.balance);
router.use('/share', routes.share);

// Static
router.use('/static', routes.staticRoute);

// Perplexica
router.use('/perplexica', routes.perplexica);

module.exports = router;

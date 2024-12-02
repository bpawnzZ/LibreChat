const ChatGPTClient = require('./ChatGPTClient');
const OpenAIClient = require('./OpenAIClient');
const PluginsClient = require('./PluginsClient');
const GoogleClient = require('./GoogleClient');
const TextStream = require('./TextStream');
const AnthropicClient = require('./AnthropicClient');
const { perplexicaClient } = require('./perplexica');
const toolUtils = require('./tools/util');

const initializeClient = () => {
  // Any initialization logic if needed
};

module.exports = {
  ChatGPTClient,
  OpenAIClient,
  PluginsClient,
  GoogleClient,
  TextStream,
  AnthropicClient,
  perplexicaClient,
  initializeClient,
  ...toolUtils,
};

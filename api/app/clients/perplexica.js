const axios = require('axios');
const crypto = require('crypto');

const perplexicaClient = async ({ text, conversationId, parentMessageId }) => {
  const baseUrl = "http://100.71.229.63:3001/api";
  const url = `${baseUrl}/search`;
  
  const payload = {
    query: text,
    focusMode: "webSearch",
    optimizationMode: "speed",
    chatModel: {
      provider: "custom_openai",
      model: "openai/gpt-4o-mini",
      customOpenAIKey: "sk-FiIu6b1Hyq7TDX-C9phogQ",
      customOpenAIBaseURL: "https://litellm.2damoon.xyz"
    },
    embeddingModel: {
      provider: "openai",
      model: "text-embedding-3-small"
    },
    history: []
  };

  try {
    const response = await axios.post(url, payload, {
      timeout: 60000,
      headers: { 'Connection': 'close' }
    });

    return {
      text: response.data.message,
      messageId: crypto.randomUUID(),
      conversationId,
      parentMessageId,
      details: {
        type: 'perplexica',
        sources: response.data.sources
      }
    };
  } catch (error) {
    console.error('Perplexica search error:', error);
    throw new Error(error.response?.data?.message || error.message || 'An error occurred during web search');
  }
};

module.exports = { perplexicaClient };

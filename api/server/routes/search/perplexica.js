const express = require('express');
const router = express.Router();
const axios = require('axios');
const { logger } = require('../../../config');

router.post('/', async (req, res) => {
  try {
    const { query } = req.body;
    const baseUrl = "http://100.71.229.63:3001/api";
    const url = `${baseUrl}/search`;
    
    const payload = {
      query,
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

    const response = await axios.post(url, payload, {
      timeout: 60000,
      headers: { 'Connection': 'close' }
    });

    res.json({
      text: response.data.message,
      sources: response.data.sources
    });
  } catch (error) {
    logger.error('Perplexica search error:', error);
    res.status(500).json({ 
      error: true,
      text: error.response?.data?.message || error.message || 'An error occurred during web search'
    });
  }
});

module.exports = router;

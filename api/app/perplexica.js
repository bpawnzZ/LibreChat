const express = require('express');
const { perplexicaClient } = require('./clients/perplexica');
const { saveMessage, getConvoTitle, saveConvo } = require('../models');
const { logger } = require('../config');

const initializePerplexica = (req, res) => {
  const {
    text,
    conversationId,
    parentMessageId,
  } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  return {
    text,
    conversationId,
    parentMessageId,
    isCreatedByUser: true,
  };
};

const handlePerplexica = async (req, res) => {
  try {
    const userMessage = initializePerplexica(req, res);
    if (!userMessage) return;

    // Save user message
    const savedUserMessage = await saveMessage({ ...userMessage, user: req.user.id });

    const response = await perplexicaClient({
      text: userMessage.text,
      conversationId: savedUserMessage.conversationId,
      parentMessageId: savedUserMessage.messageId,
    });

    // Save assistant message
    const assistantMessage = {
      text: response.text,
      conversationId: response.conversationId,
      parentMessageId: response.parentMessageId,
      isCreatedByUser: false,
      error: false,
      user: req.user.id,
    };

    const savedAssistantMessage = await saveMessage(assistantMessage);

    // Update or create conversation
    const title = await getConvoTitle(req.user.id, savedAssistantMessage.conversationId, userMessage.text);
    await saveConvo(req, {
      conversationId: savedAssistantMessage.conversationId,
      title,
    });

    return res.json({
      userMessage: savedUserMessage,
      assistantMessage: savedAssistantMessage,
      conversationId: savedAssistantMessage.conversationId,
      title
    });
  } catch (error) {
    logger.error('Error in Perplexica handler:', error);
    const errorMessage = {
      text: error.message,
      conversationId: req.body.conversationId,
      parentMessageId: req.body.parentMessageId,
      isCreatedByUser: false,
      error: true,
      user: req.user.id,
    };
    
    const savedMessage = await saveMessage(errorMessage);
    return res.status(500).json({ error: error.message, message: savedMessage });
  }
};

module.exports = { handlePerplexica };

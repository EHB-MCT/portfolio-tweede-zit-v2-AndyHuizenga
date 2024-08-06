//routes/conent.js

const express = require('express');
const router = express.Router();
const contentfulService = require('../services/contentfulService');

// GET /api/content/:channel - Fetch content based on channel number
router.get('/:channel', async (req, res) => {
  const channel = parseInt(req.params.channel, 10);
  if (isNaN(channel)) {
    return res.status(400).json({ error: 'Invalid channel number' });
  }

  try {
    const content = await contentfulService.getContentByChannel(channel);
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


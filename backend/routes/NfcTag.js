// routes/nfcTag.js
const express = require('express');
const router = express.Router();
const contentfulService = require('../services/contentfulService');

// GET /api/nfc/:tagId - Fetch content based on NFC tag ID
router.get('/:tagId', async (req, res) => {
  const tagId = req.params.tagId;
  try {
    const channel = parseInt(tagId, 10); // Assuming tagId directly maps to channel number
    if (isNaN(channel)) {
      return res.status(400).json({ error: 'Invalid tag ID' });
    }

    const content = await contentfulService.getContentByChannel(channel);
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const axios = require('axios');
const contentfulService = require('../services/contentfulService');
// GET /api/content - Fetch all recall items
router.get('/', async (req, res) => {
  try {
    const recallItems = await contentfulService.getAllRecallItems();
    console.log('Recall items fetched successfully:', recallItems);
    res.status(200).json(recallItems);
  } catch (error) {
    console.error('Error fetching recall items:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/content/:channel - Fetch content based on channel number
router.get('/recall/:channel', async (req, res) => {
  const channel = parseInt(req.params.channel, 10);
  console.log(`Received request for channel: ${channel}`);
  
  if (isNaN(channel)) {
    console.log('Invalid channel number');
    return res.status(400).json({ error: 'Invalid channel number' });
  }

  try {
    const content = await contentfulService.getContentByChannel(channel);
    console.log('Content fetched successfully:', content);
    res.status(200).json(content);
  } catch (error) {
    console.error('Error fetching content:', error.message);
    res.status(500).json({ error: error.message });
  }
});


router.post('/createEntry', async (req, res) => {
  console.log("Received POST request to /createEntry");
  console.log("Request body:", req.body);

  try {
    // Create and publish the entry
    const publishedEntry = await contentfulService.addRecallItem(req.body);
    console.log('Entry created and published:', publishedEntry);

    res.status(201).json(publishedEntry); // Respond with the published entry data
  } catch (error) {
    console.error('Error occurred:', error.response ? {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    } : error.message);
    res.status(error.response ? error.response.status : 500).json({
      error: error.message,
      details: error.response ? error.response.data : {}
    });
  }
});

// GET /api/authors - Fetch all authors



// GET /api/availableChannels - Fetch available channel numbers
router.get('/authors', async (req, res) => {
  try {
    // Fetch authors using the service
    const authors = await contentfulService.getAllAuthors();
    console.log('Authors fetched and sent successfully:', authors);
    res.status(200).json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
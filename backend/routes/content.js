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


// POST /api/content/createEntry - Create and publish entry
router.post('/createEntry', async (req, res) => {
  console.log("Received POST request to /createEntry");
  console.log("Request body:", req.body);

  try {
    // Step 1: Create the entry
    const createResponse = await axios.post(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries`,
      {
        fields: {
          channel: { "en-US": req.body.channel },
          title: { "en-US": req.body.title },
          date: { "en-US": req.body.date },
          content: { "en-US": req.body.content.map(assetId => ({ sys: { type: "Link", linkType: "Asset", id: assetId } })) },
          contentType: { "en-US": req.body.contentType },
          description: { "en-US": req.body.description },
          author: { "en-US": { sys: { type: "Link", linkType: "Entry", id: req.body.authorId } } },
          thumbnail: { "en-US": { sys: { type: "Link", linkType: "Asset", id: req.body.thumbnailId } } }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json',
          'X-Contentful-Content-Type': 'recallItem' // Ensure this is the correct content type ID
        }
      }
    );

    const entryId = createResponse.data.sys.id;
    console.log('Entry created with ID:', entryId);

    // Step 2: Publish the entry
    const publishResponse = await axios.post(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries/${entryId}/publish`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json'
        }
      }
    );

    console.log('Entry published:', publishResponse.data);

    // Verify entry status after publishing
    const entryStatusResponse = await axios.get(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries/${entryId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json'
        }
      }
    );
    console.log('Entry status:', entryStatusResponse.data);

    res.status(201).json(publishResponse.data); // Respond with the published entry data
  } catch (error) {
    console.error('Error occurred:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({
      error: error.message,
      details: error.response ? error.response.data : {}
    });
  }
});

module.exports = router;




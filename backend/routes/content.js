// routes/content.js
const express = require('express');
const router = express.Router();
const contentfulService = require('../services/contentfulService');
const multer = require('multer');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
const { log } = require('console');
const nodemailer = require('nodemailer');

// GET /api/recall/:channel - Fetch content based on channel number
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

// POST /api/createEntry - Create and publish a recall item
router.post('/createEntry', async (req, res) => {
  console.log("Received POST request to /createEntry");
  console.log("Request body:", req.body);

  // Validate the request body
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Invalid request format',
      details: 'Request body must be an object'
    });
  }

  const { content, channel, title, date, contentType, description, authorName, thumbnail } = req.body;

  if (!Array.isArray(content)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request format',
      details: 'data.content must be an array'
    });
  }

  if (!channel || !title || !date || !contentType || !authorName) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      details: 'channel, title, date, contentType, and authorName are required'
    });
  }

  try {
    // Call service to handle Contentful entry creation
    const publishedEntry = await contentfulService.addRecallItem({
      content,
      channel,
      title,
      date,
      contentType,
      description,
      authorName, // Pass the author name instead of author object
      thumbnail
    });

    res.status(201).json({
      success: true,
      message: 'Recall item created successfully',
      data: publishedEntry
    }); // Respond with the published entry data
  } catch (error) {
    // Improved error handling
    console.error('Error occurred:', error.message);
    console.error('Error details:', error.response ? error.response.data : error.stack);

    res.status(error.response ? error.response.status : 500).json({
      success: false,
      error: error.message,
      details: error.response ? error.response.data : {}
    });
  }
});



// GET /api/authors - Fetch all authors
router.get('/authors', async (req, res) => {
  try {
    const authors = await contentfulService.getAllAuthors();
    console.log('Authors fetched and sent successfully:', authors);
    res.status(200).json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/availableChannels - Fetch available channel numbers
router.get('/availableChannels', async (req, res) => {
  try {
    const usedChannels = await contentfulService.getUsedChannelNumbers();
    const allPossibleChannels = Array.from({ length: 50 }, (_, i) => i + 1); // Channel numbers from 1 to 50
    const availableChannels = allPossibleChannels.filter(channel => !usedChannels.includes(channel));

    res.status(200).json(availableChannels);
  } catch (error) {
    console.error('Error fetching available channel numbers:', error.message);
    res.status(500).json({ error: error.message });
  }
});



// In your backend service or API
router.post('/assets', async (req, res) => {
  try {
    const assetNames = req.body.names; // Expecting an array of names in the body

    if (!Array.isArray(assetNames)) {
      return res.status(400).json({ error: 'Invalid request format. Expected an array of names.' });
    }

    // Fetch assets using the provided names
    const assets = await contentfulService.getExistingAssets(assetNames);
    
    res.status(200).json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/assetList', async (req, res) => {
  try {
    const assets = await contentfulService.getAllExistingAssets(); // Fetch all assets
    res.status(200).json(assets);
  } catch (error) {
    console.error('Error fetching all assets:', error.message);
    res.status(500).json({ error: error.message });
  }
});





// Configure multer to handle file uploads
const upload = multer({ dest: 'uploads/' });



router.post('/upload', upload.fields([{ name: 'content', maxCount: 10 }]), async (req, res) => {
  try {
    if (!req.files['content'] || req.files['content'].length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded under "content".' });
    }

    const filePromises = req.files['content'].map(async (file) => {
      try {
        const contentfulAsset = await contentfulService.uploadFileToContentful(file);
        fs.unlinkSync(file.path); // Clean up file
        return contentfulAsset.sys.id;
      } catch (fileError) {
        console.error('Error processing file:', fileError.message);
        throw fileError;
      }
    });

    const fileIds = await Promise.all(filePromises);
    res.json({ success: true, fileIds });
  } catch (error) {
    console.error('Error during file upload:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});


// POST /api/content/createAuthor - Create and publish a new author
router.post('/createAuthor', async (req, res) => {
  const { name, relationship, profilePicture, email, contactnumber, description, bday } = req.body;

  try {
    // Create author entry in Contentful
    const result = await contentfulService.createAuthor(name, relationship, profilePicture, email, contactnumber, description, bday);
    
    // Respond with success status and the result from the service
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    // Log the error and respond with failure status
    console.error('Error creating author:', error);
    return res.status(500).json({ success: false, message: 'Failed to create author.' });
  }
});



// routes/content.js
// GET /api/steps - Fetch all steps
router.get('/steps', async (req, res) => {
  try {
    const steps = await contentfulService.getSteps();
    res.json(steps);
  } catch (error) {
    console.error('Error fetching steps:', error.message);
    res.status(500).json({ error: 'Failed to fetch steps', details: error.message });
  }
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS  // your email password
  }
});
router.post('/sendEmail', async (req, res) => {
  const { email, content } = req.body; 
console.log(`email has been sent to ${email}`)
  // Ensure the email is properly defined and valid
  if (!email) {
    return res.status(400).json({ success: false, message: 'Recipient email not provided' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email, // Send to the user's email address
    subject: 'Your Profile Has Been Created',
    text: content // Use the personalized email content
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});


console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Pass:', process.env.EMAIL_PASS);



module.exports = router;






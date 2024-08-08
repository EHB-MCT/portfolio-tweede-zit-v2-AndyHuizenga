// services/contentfulService.js
const contentful = require('contentful');
const contentfulManagement = require('contentful-management'); 

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

const managementClient = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN, // Correct management access token
});


const getContentByChannel = async (channel) => {
  try {
    const entries = await client.getEntries({
      content_type: 'recallItem',
      'fields.channel': channel,
    });

    if (entries.items.length > 0) {
      return entries.items[0].fields;
    } else {
      throw new Error('No content found for this channel');
    }
  } catch (error) {
    throw error;
  }
};

const getAllRecallItems = async () => {
  try {
    const entries = await client.getEntries({
      content_type: 'recallItem',
    });

    if (entries.items.length > 0) {
      return entries.items.map(item => item.fields);
    } else {
      throw new Error('No recall items found');
    }
  } catch (error) {
    throw error;
  }
};

const addRecallItem = async (data) => {
  try {
    // Get the space and environment
    const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master'); // or any other environment name

    // Create a new entry
    const entry = await environment.createEntry('recallItem', {
      fields: {
        channel: { 'en-US': data.channel }, // Integer
        title: { 'en-US': data.title }, // Symbol
        date: { 'en-US': data.date }, // Date
        content: { 'en-US': data.content }, // Array of asset links
        contentType: { 'en-US': data.contentType }, // Symbol
        description: { 'en-US': data.description }, // Text
        author: { 'en-US': { sys: { id: data.author } } }, // Link to an entry
        thumbnail: { 'en-US': { sys: { id: data.thumbnail } } }, // Link to an asset
      },
    });

    // Publish the entry
    await entry.publish();
    return entry;
  } catch (error) {
    console.error('Error adding recall item:', error);
    throw error;
  }
};



module.exports = {
  getContentByChannel,
  getAllRecallItems,
  addRecallItem,
};


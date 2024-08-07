// services/contentfulService.js
const contentful = require('contentful');

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
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

module.exports = {
  getContentByChannel,
  getAllRecallItems, // Export the new function
};
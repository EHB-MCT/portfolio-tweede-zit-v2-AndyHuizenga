// config/contentfulService.js
const contentful = require('contentful');

console.log('Contentful Space ID:', process.env.CONTENTFUL_SPACE_ID);
console.log('Contentful Access Token:', process.env.CONTENTFUL_ACCESS_TOKEN);


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

module.exports = {
  getContentByChannel,
};


const testContentfulConnection = async () => {
    try {
      const entries = await client.getEntries({ limit: 1 });
      console.log('Contentful connection test successful:', entries.items.length > 0 ? 'Entries found' : 'No entries found');
    } catch (error) {
      console.error('Error testing Contentful connection:', error.message);
    }
  };
  
  // Call this function
  testContentfulConnection();
  
const contentful = require('contentful');
const contentfulManagement = require('contentful-management');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

// Initialize Contentful clients
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

const managementClient = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
});

// Utility function to get Contentful space and environment
const getEnvironment = async () => {
  const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
  return space.getEnvironment('master');
};

// Fetch content by channel number
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

// Fetch all recall items
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

// Fetch all authors
const getAllAuthors = async () => {
  try {
    const environment = await getEnvironment();
    const entries = await environment.getEntries({ content_type: 'author' });

    const authors = entries.items.map(entry => {
      const fields = entry.fields;

      const name = fields.name ? fields.name['en-US'] : null;
      const profilePictureId = fields.profilePicture ? fields.profilePicture['en-US'].sys.id : null;
      const relationship = fields.relationship ? fields.relationship['en-US'] : null;
      const code = fields.code ? fields.code['en-US'] : null;

      return {
        name,
        profilePicture: profilePictureId, // Return only the profile picture ID
        relationship,
        code
      };
    });

    return authors;
  } catch (error) {
    console.error('Error fetching authors:', error.message);
    throw error;
  }
};







// Fetch existing assets
const getExistingAssets = async () => {
  try {
    const environment = await getEnvironment();
    const entries = await environment.getAssets();
    console.log('Existing assets:', entries.items.map(item => item.sys.id)); // Log all existing asset IDs
    return entries.items;
  } catch (error) {
    throw error;
  }
};



// Add and publish a recall item
const addRecallItem = async (data) => {
  try {
    // Ensure content is an array and extract asset IDs
    if (!Array.isArray(data.content)) {
      throw new TypeError('data.content must be an array');
    }

    const contentAssetIds = data.content.map(item => ({
      sys: { type: "Link", linkType: "Asset", id: item.id }
    }));

    // Prepare the data for creating the entry
    const entryData = {
      fields: {
        channel: { 'en-US': data.channel },
        title: { 'en-US': data.title },
        date: { 'en-US': data.date },
        content: { 
          'en-US': contentAssetIds 
        },
        contentType: { 'en-US': data.contentType },
        description: { 'en-US': data.description },
        author: { 
          'en-US': { 
            sys: { type: "Link", linkType: "Entry", id: data.author.sys.id } 
          } 
        },
        thumbnail: {
          'en-US': {
            sys: { 
              type: "Link", linkType: "Asset", id: data.thumbnail.sys.id 
            }
          }
        }
      }
    };

    // Create the entry in Contentful
    const environment = await getEnvironment();
    const entry = await environment.createEntry('recallItem', entryData);
    
    // Publish the entry
    return await publishEntry(entry.sys.id);
  } catch (error) {
    console.error('Error adding recall item:', error.message);
    throw error;
  }
};







// Publish an entry
async function publishEntry(entryId) {
  try {
    const environment = await getEnvironment();
    const entry = await environment.getEntry(entryId);

    // Ensure the entry has a thumbnail field before publishing
    if (entry.fields.thumbnail) {
      await entry.publish();
      console.log('Entry published successfully');
    } else {
      throw new Error('Missing required field: thumbnail');
    }
  } catch (error) {
    console.error('Error publishing entry:', error.message);
  }
}



// Get used channel numbers
const getUsedChannelNumbers = async () => {
  try {
    const entries = await client.getEntries({
      content_type: 'recallItem',
      select: 'fields.channel'
    });

    return entries.items.map(item => item.fields.channel);
  } catch (error) {
    throw error;
  }
};



const uploadFileToContentful = async (file) => {
  try {
    const environment = await getEnvironment();

    // Upload the file
    const upload = await environment.createUpload({ file: fs.createReadStream(file.path) });

    // Create an asset from the uploaded file
    let asset = await environment.createAsset({
      fields: {
        title: {
          'en-US': file.originalname, // Use the original file name as the title
        },
        description: {
          'en-US': 'recall media content', // Automatically add description
        },
        file: {
          'en-US': {
            contentType: mime.lookup(file.originalname) || 'application/octet-stream', // Use mime-types to get MIME type
            fileName: file.originalname, // Use the original file name
            uploadFrom: {
              sys: {
                type: 'Link',
                linkType: 'Upload',
                id: upload.sys.id,
              },
            },
          },
        },
      },
    });

    // Process the asset
    await asset.processForAllLocales();

    // Fetch the asset again to get the latest version
    asset = await environment.getAsset(asset.sys.id);

    // Publish the asset
    const publishedAsset = await asset.publish();

    console.log('Asset published successfully:', publishedAsset);
    return publishedAsset;
  } catch (error) {
    console.error('Error uploading file:', error.message);
    if (error.response && error.response.status === 409) {
      console.error('Version mismatch error. Please try again.');
    }
    throw error;
  }
};
const createAuthor = async (name, relationship, profilePicture) => {
  try {
    // Generate a random 10-digit code
    const code = Math.floor(1000000000 + Math.random() * 9000000000);
    console.log('Generated code:', code);

    // Prepare the data for creating the author entry
    const authorData = {
      fields: {
        name: { 'en-US': name },
        relationship: { 'en-US': relationship },
        code: { 'en-US': code },
        profilePicture: profilePicture
          ? { 'en-US': { sys: { type: 'Link', linkType: 'Asset', id: profilePicture } } }
          : undefined
      }
    };

    // Get the environment and create the entry
    const environment = await getEnvironment(); 
    const entry = await environment.createEntry('author', authorData);
    console.log('Author entry created:', entry.sys.id);

    // Publish the entry
    const publishedEntry = await entry.publish();
    console.log('Author entry published successfully:', publishedEntry.sys.id);

    // Return the published entry fields and the generated code
    return { author: publishedEntry.fields, code };
  } catch (error) {
    console.error('Error creating author entry:', error.message);
    throw error; // Rethrow the error to be handled by the route
  }
};










module.exports = {
  getContentByChannel,
  getAllRecallItems,
  addRecallItem,
  getAllAuthors,
  getExistingAssets,
  getUsedChannelNumbers,
  uploadFileToContentful,
  createAuthor,
};

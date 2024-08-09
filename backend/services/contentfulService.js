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
    const recallItems = await getAllRecallItems();
    const uniqueAuthors = new Map();

    recallItems.forEach(item => {
      const author = item.author;
      if (author && !uniqueAuthors.has(author.sys.id)) {
        const profilePictureUrl = author.fields.profilePicture
          ? `https:${author.fields.profilePicture.fields.file.url}`
          : '';

        uniqueAuthors.set(author.sys.id, {
          name: author.fields.name,
          id: author.sys.id,
          profilePicture: profilePictureUrl,
        });
      }
    });

    return Array.from(uniqueAuthors.values());
  } catch (error) {
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
    if (!Array.isArray(data.content)) {
      throw new TypeError('data.content must be an array');
    }

    const contentAssetIds = data.content.every(item => typeof item === 'string')
      ? data.content
      : data.content.map(item => item.sys.id);

    const existingAssets = await getExistingAssets();
    const contentAssetsExist = contentAssetIds.every(assetId => existingAssets.some(asset => asset.sys.id === assetId));

    if (!contentAssetsExist) {
      throw new Error('One or more Content Asset IDs do not exist');
    }

    const environment = await getEnvironment();

    const entry = await environment.createEntry('recallItem', {
      fields: {
        channel: { 'en-US': data.channel },
        title: { 'en-US': data.title },
        date: { 'en-US': data.date },
        content: { 'en-US': contentAssetIds.map(assetId => ({ sys: { type: "Link", linkType: "Asset", id: assetId } })) },
        contentType: { 'en-US': data.contentType },
        description: { 'en-US': data.description },
        author: { 'en-US': { sys: { type: "Link", linkType: "Entry", id: data.authorId } } },
        thumbnail: data.thumbnailId ? { 'en-US': { sys: { type: "Link", linkType: "Asset", id: data.thumbnailId } } } : undefined,
      },
    });

    return publishEntry(entry.sys.id);
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








module.exports = {
  getContentByChannel,
  getAllRecallItems,
  addRecallItem,
  getAllAuthors,
  getExistingAssets,
  getUsedChannelNumbers,
  uploadFileToContentful,
};

// services/contentfulService.js
const contentful = require('contentful');
const contentfulManagement = require('contentful-management'); 
const fs = require('fs');
const path = require('path');


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


// Fetch existing authors
const getAllAuthors = async () => {
  try {
    const entries = await client.getEntries({
      content_type: 'author', // Assuming 'author' is the content type ID for authors
    });
    return entries.items.map(item => item.fields);
  } catch (error) {
    throw error;
  }
};


// Fetch existing assets
const getExistingAssets = async () => {
  try {
    const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');

    // Fetch assets
    const entries = await environment.getAssets();

    return entries.items;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

const testFetchingData = async () => {
  try {
    const authors = await getExistingAuthors();
    console.log('Existing Authors:', authors);

    const assets = await getExistingAssets();
    console.log('Existing Assets:', assets);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Function to upload a thumbnail and return its asset ID
const uploadThumbnail = async () => {
  try {
    const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');

    // Path to the thumbnail file
    const filePath = path.join(__dirname, '../assets/thumbnail.jpeg');
    const file = fs.readFileSync(filePath);

    // Create a new asset
    const asset = await environment.createAsset({
      fields: {
        title: { 'en-US': 'Thumbnail Image' },
        description: { 'en-US': 'A thumbnail image for the recall item' },
        file: {
          'en-US': {
            contentType: 'image/jpeg',
            fileName: 'thumbnail.jpeg',
            upload: file,
          },
        },
      },
    });

    // Process and publish the asset
    await asset.processForAllLocales();
    const publishedAsset = await asset.publish();
    console.log('Thumbnail uploaded and published successfully:', publishedAsset.sys.id);
    return publishedAsset.sys.id;
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    throw error;
  }
};

const addRecallItem = async (data) => {
  try {
    const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');

    // Fetch existing assets to validate content
    const existingAssets = await getExistingAssets();
    const contentAssetsExist = data.content.every(assetId => existingAssets.some(asset => asset.sys.id === assetId));

    if (!contentAssetsExist) {
      throw new Error('One or more Content Asset IDs do not exist');
    }

    // Handle the thumbnail field
    let thumbnailAssetId;
    if (data.thumbnailId) {
      // Ensure thumbnailId is a single ID, not an array
      thumbnailAssetId = Array.isArray(data.thumbnailId) ? data.thumbnailId[0] : data.thumbnailId;
    } else {
      // If thumbnailId is not provided, upload a new thumbnail
      thumbnailAssetId = await uploadThumbnail();
    }

    // Create a new entry
    const entry = await environment.createEntry('recallItem', {
      fields: {
        channel: { 'en-US': data.channel },
        title: { 'en-US': data.title },
        date: { 'en-US': data.date },
        content: { 'en-US': data.content.map(assetId => ({ sys: { type: "Link", linkType: "Asset", id: assetId } })) },
        contentType: { 'en-US': data.contentType },
        description: { 'en-US': data.description },
        author: { 'en-US': { sys: { type: "Link", linkType: "Entry", id: data.authorId } } },
        thumbnail: { 'en-US': { sys: { type: "Link", linkType: "Asset", id: thumbnailAssetId } } },
      },
    });

    const publishedEntry = await publishEntry(entry.sys.id);
    return publishedEntry;
  } catch (error) {
    console.error('Error adding recall item:', error);
    throw error;
  }
};

const publishEntry = async (entryId) => {
  try {
    const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');

    // Fetch the entry
    const entry = await environment.getEntry(entryId);

    // Publish the entry
    const publishedEntry = await entry.publish();
    console.log('Entry published successfully:', publishedEntry.sys.id);
    return publishedEntry;
  } catch (error) {
    console.error('Error publishing entry:', error);
    throw error;
  }
};

const getUsedChannelNumbers = async () => {
  try {
    const entries = await client.getEntries({
      content_type: 'recallItem',
      select: 'fields.channel'
    });

    const usedChannels = entries.items.map(item => item.fields.channel);
    return usedChannels;
  } catch (error) {
    console.error('Error fetching used channel numbers:', error);
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
};


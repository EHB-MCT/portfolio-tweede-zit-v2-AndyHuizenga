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
      const profilePicture = fields.profilePicture ? fields.profilePicture['en-US'].sys.id : null;
      const relationship = fields.relationship ? fields.relationship['en-US'] : null;
      const code = fields.code ? fields.code['en-US'] : null;
      const email = fields.email ? fields.email['en-US'] : null;
      const contactnumber = fields.contactnumber ? fields.contactnumber['en-US'] : null;
      const description = fields.description ? fields.description['en-US'] : null;
      const bday = fields.bday ? fields.bday['en-US'] : null;

      return {
        name,
        profilePicture, // Return only the profile picture ID
        relationship,
        code,
        email,
        contactnumber,
        description,
        bday
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
    console.log("First entry:", entries.items[0]);
    console.log('Existing assets:', entries.items.map(item => ({
      id: item.sys.id,
      title: item.fields.title['en-US']
    }))); // Log all existing asset details
    return entries.items;
  } catch (error) {
    console.error('Error fetching assets:', error.message);
    throw error;
  }
};

// Add and publish a recall item
const addRecallItem = async (data) => {
  try {
    if (!Array.isArray(data.content)) {
      throw new TypeError('data.content must be an array');
    }

    const contentAssetIds = data.content.map(item => ({
      sys: { type: "Link", linkType: "Asset", id: item.id }
    }));

    if (!data.author || !data.author.sys || !data.author.sys.id) {
      throw new TypeError('Invalid author data');
    }

    const entryData = {
      fields: {
        channel: { 'en-US': data.channel },
        title: { 'en-US': data.title },
        date: { 'en-US': data.date },
        content: { 'en-US': contentAssetIds },
        contentType: { 'en-US': data.contentType },
        description: { 'en-US': data.description },
        author: { 
          'en-US': { 
            sys: { type: "Link", linkType: "Entry", id: data.author.sys.id } 
          } 
        },
        thumbnail: data.thumbnail 
          ? { 
              'en-US': { 
                sys: { 
                  type: "Link", linkType: "Asset", id: data.thumbnail.sys.id 
                } 
              } 
            } 
          : undefined
      }
    };

    const response = await client.createEntry('recallItem', entryData);

    if (data.thumbnail && data.thumbnail.sys && data.thumbnail.sys.id) {
      const environment = await getEnvironment();
      const thumbnailAsset = await environment.getAsset(data.thumbnail.sys.id);
      await thumbnailAsset.processForAllLocales();
      const processedAsset = await environment.getAsset(thumbnailAsset.sys.id);
      await processedAsset.publish();
    }

    const publishedEntry = await response.publish();
    console.log('Recall item published successfully:', publishedEntry.sys.id);

    return publishedEntry;
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

// Upload file to Contentful
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

// Create an author
const createAuthor = async (name, relationship, profilePicture, email, contactnumber, description, bday) => {
  try {
    const code = Math.floor(1000000000 + Math.random() * 9000000000); // Generate a unique code
    console.log('Generated code:', code);

    const contactNumberAsInteger = parseInt(contactnumber, 10);
    if (isNaN(contactNumberAsInteger)) {
      throw new Error('Invalid contact number format. It should be an integer.');
    }

    const authorData = {
      fields: {
        name: { 'en-US': name },
        relationship: { 'en-US': relationship },
        code: { 'en-US': code },
        profilePicture: profilePicture
          ? { 'en-US': { sys: { type: 'Link', linkType: 'Asset', id: profilePicture } } }
          : undefined,
        email: { 'en-US': email },
        contactnumber: { 'en-US': contactNumberAsInteger },
        description: { 'en-US': description },
        bday: { 'en-US': bday }
      }
    };

    const environment = await getEnvironment();
    const entry = await environment.createEntry('author', authorData);
    console.log('Author entry created:', entry.sys.id);

    const publishedEntry = await entry.publish();
    console.log('Author entry published successfully:', publishedEntry.sys.id);

    return { id: publishedEntry.sys.id, ...publishedEntry.fields, code };
  } catch (error) {
    console.error('Error creating author entry:', error.message);
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
  createAuthor,
};

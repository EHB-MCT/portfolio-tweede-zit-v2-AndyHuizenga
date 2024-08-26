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

console.log('CONTENTFUL_ACCESS_TOKEN:', process.env.CONTENTFUL_ACCESS_TOKEN);
console.log('CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:', process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN);

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
      include: 2, // Include linked entries up to 2 levels deep
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

    const authors = await Promise.all(entries.items.map(async entry => {
      const fields = entry.fields;

      const name = fields.name ? fields.name['en-US'] : null;
      const profilePictureId = fields.profilePicture ? fields.profilePicture['en-US'].sys.id : null;
      const relationship = fields.relationship ? fields.relationship['en-US'] : null;
      const code = fields.code ? fields.code['en-US'] : null;
      const email = fields.email ? fields.email['en-US'] : null;
      const contactnumber = fields.contactnumber ? fields.contactnumber['en-US'] : null;
      const description = fields.description ? fields.description['en-US'] : null;
      const bday = fields.bday ? fields.bday['en-US'] : null;

      // Fetch the asset URL using the profilePictureId
      let profilePictureUrl = null;
      if (profilePictureId) {
        const asset = await environment.getAsset(profilePictureId);
        profilePictureUrl = asset.fields.file['en-US'].url;
      }

      return {
        name,
        profilePictureUrl: profilePictureUrl ? `https:${profilePictureUrl}` : null, // Prepend https: to the URL
        relationship,
        code,
        email,
        contactnumber,
        description,
        bday
      };
    }));

    return authors;
  } catch (error) {
    console.error('Error fetching authors:', error.message);
    throw error;
  }
};

// Fetch existing assets
const getExistingAssets = async (assetNames = []) => {
  try {
    const environment = await getEnvironment();
    const entries = await environment.getAssets();

    // Filter assets based on the provided names in the query
    const filteredAssets = entries.items.filter(item => {
      const title = item.fields.title['en-US'];
      return assetNames.includes(title);
    });

    return filteredAssets.map(item => ({
      id: item.sys.id,
      title: item.fields.title['en-US'],
      url: item.fields.file['en-US'].url, 
    }));
  } catch (error) {
    console.error('Error fetching assets:', error.message);
    throw error;
  }
};
const getAllExistingAssets = async () => {
  try {
    const environment = await getEnvironment();
    const entries = await environment.getAssets();

    return entries.items.map(item => ({
      id: item.sys.id,
      title: item.fields.title['en-US'],
      url: item.fields.file['en-US'].url, 
    }));
  } catch (error) {
    console.error('Error fetching all assets:', error.message);
    throw error;
  }
};



const findAuthorByName = async (name) => {
  try {
    const environment = await getEnvironment();
    const entries = await environment.getEntries({
      content_type: 'author',
      'fields.name[match]': name
    });

    if (entries.items.length === 0) {
      throw new Error('No author found with the given name');
    }


    return entries.items[0];
  } catch (error) {
    console.error('Error fetching author:', error.message);
    throw error;
  }
};


// Add and publish a recall item
const addRecallItem = async (data) => {
  try {
    if (!Array.isArray(data.content)) {
      throw new TypeError('data.content must be an array');
    }

    // Map the content field to ensure it follows the required format
    const contentAssetIds = data.content.map(item => ({
      sys: { type: 'Link', linkType: 'Asset', id: item.sys.id }
    }));

    if (!data.authorName) {
      throw new TypeError('Author name is required');
    }

    // Fetch the author by name
    const authorEntry = await findAuthorByName(data.authorName);

    if (!authorEntry || !authorEntry.sys || !authorEntry.sys.id) {
      throw new Error('Invalid author data');
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
            sys: { type: 'Link', linkType: 'Entry', id: authorEntry.sys.id } 
          } 
        },
        thumbnail: data.thumbnail 
          ? { 
              'en-US': { 
                sys: { 
                  type: 'Link', linkType: 'Asset', id: data.thumbnail.sys.id 
                } 
              } 
            } 
          : undefined
      }
    };

    const environment = await getEnvironment();
    
    // Create the entry
    const response = await environment.createEntry('recallItem', entryData);
    console.log('Recall item entry created:', response.sys.id);

    // Publish the recall item entry
    const publishedEntry = await response.publish();
    console.log('Recall item published successfully:', publishedEntry.sys.id);

    return publishedEntry;
  } catch (error) {
    console.error('Error adding recall item:', error.message);
    if (error.response) {new
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

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
          'en-US': file.originalname,
        },
        description: {
          'en-US': 'recall media content', 
        },
        file: {
          'en-US': {
            contentType: mime.lookup(file.originalname) || 'application/octet-stream', 
            fileName: file.originalname, 
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

async function getSteps() {
  try {
    // Fetch entries of type 'steps'
    const response = await client.getEntries({
      content_type: 'steps',
      include: 2 // Include linked assets up to two levels deep
    });

    console.log('Contentful response:', response); // Log the full response for debugging

    if (response.items.length === 0) {
      throw new Error('No steps content found');
    }

    // Assuming there's only one entry (or take the first entry as an example)
    const item = response.items[0].fields;

    // Extract general information about the steps entry
    const name = item.name || 'No name provided';
    const descriptionWholeStep = item.descriptionWholeStep || 'No description provided';

    // Extract asset IDs from the fields
    const assetIds = Object.keys(item)
      .filter(key => key.startsWith('step') && item[key] && item[key].sys)
      .map(key => item[key].sys.id);

    // Map assets to their URLs
    const assetsMap = response.includes.Asset.reduce((acc, asset) => {
      acc[asset.sys.id] = `https:${asset.fields.file.url}`; // Ensure URL is correctly formatted
      return acc;
    }, {});

    // Create the structured steps object
    const steps = Object.keys(item)
      .filter(key => key.startsWith('step') && item[key] && item[key].sys)
      .map(key => {
        const assetId = item[key].sys.id;
        return {
          url: assetsMap[assetId] || 'URL not found',
          description: response.includes.Asset.find(asset => asset.sys.id === assetId)?.fields.description || ''
        };
      });

    return {
      name,
      descriptionWholeStep,
      steps
    };

  } catch (error) {
    console.error('Error fetching steps from Contentful:', error.message);
    throw error;
  }
}


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
  getAllExistingAssets,
  getSteps,

};

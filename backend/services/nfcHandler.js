// services/nfcHandler.js
const nfc = require('nfc-pcsc'); // Adjust based on your library

// Function to initialize NFC reader and handle events
function initializeNfc(io) {
  const nfcReader = new nfc.NFC();

  nfcReader.on('reader', (reader) => {
    console.log(`${reader.reader.name} device attached`);

    reader.on('card', async (card) => {
      console.log('Card detected:', card);

      try {
        const data = await reader.read(4, 20); // Adjust block number and length as needed
        const payload = data.toString('utf8');
        console.log('Data read:', payload);

        // Emit the tag number to frontend
        io.emit('tagNumber', payload);
      } catch (err) {
        console.error('Error reading data:', err);
      }
    });

    reader.on('error', (err) => {
      console.log(`${reader.reader.name} an error occurred:`, err);
    });

    reader.on('end', () => {
      console.log(`${reader.reader.name} device removed`);
    });
  });

  nfcReader.on('error', (err) => {
    console.log('NFC error:', err);
  });
}

module.exports = initializeNfc;

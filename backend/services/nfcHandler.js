let initializeNfc;

if (process.env.NODE_ENV === 'development') {
  const nfc = require('nfc-pcsc'); // Load NFC library only in development

  // Function to initialize NFC reader and handle events
  initializeNfc = function (io) {
    const nfcReader = new nfc.NFC();

    nfcReader.on('reader', (reader) => {
      console.log(`${reader.reader.name} device attached`);

      reader.on('card', async (card) => {
        console.log('Card detected:', card);

        try {
          const blockNumber = 4; // Adjust block number as needed
          const blockSize = 16; // Typically, NFC blocks are 16 bytes in size

          // Read data from NFC tag
          const data = await reader.read(blockNumber, blockSize);

          // Log the raw data
          console.log('Raw data (Buffer):', data);
          console.log('Raw data (Hex):', data.toString('hex'));
          console.log('Raw data (UTF-8):', data.toString('utf8'));

          // Extract numeric data from the raw data
          const numericData = extractNumericData(data.toString('utf8'));
          console.log('Extracted Numeric Data:', numericData);

          // Emit the extracted numeric data to frontend
          io.emit('tagNumber', numericData);
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

    return nfcReader; // Return nfcReader if needed for other purposes
  };
} else {
  // In production, return a dummy function or nothing
  initializeNfc = function () {
    console.log('NFC not supported in this environment.');
  };
}

function extractNumericData(utf8String) {
  const match = utf8String.match(/\d+/); // Extract all digits
  return match ? match[0] : 'Invalid Data';
}

module.exports = initializeNfc;
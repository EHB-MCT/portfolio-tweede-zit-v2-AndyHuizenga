// Import necessary libraries
const nfc = require('nfc-pcsc'); // Ensure correct NFC library

// Initialize NFC reader
const nfcReader = new nfc.NFC();

let activateWriteData = false; // Control flag for write operations

// Function to handle NFC reader events
function handleNfcReader(reader) {
    console.log(`${reader.reader.name} device attached`);

    reader.on('card', async card => {
        console.log(`Card detected:`, card);

        try {
            // Read data from NFC tag
            const data = await reader.read(4, 20); // Adjust block number and length as needed
            const payload = data.toString('utf8');
            console.log(`Data read:`, payload);
            
            // Emit the tag number to frontend
            io.emit('tagNumber', payload);
            
            // Conditionally write data to NFC tag
            if (activateWriteData) {
                await writeData(reader, 4, "1"); // Example: write to block 4
            }
        } catch (err) {
            console.error(`Error reading data: ${err.message}`);
        }
    });

    reader.on('error', err => {
        console.log(`${reader.reader.name} an error occurred:`, err);
    });

    reader.on('end', () => {
        console.log(`${reader.reader.name} device removed`);
    });
}

// Register event listeners for NFC reader
nfcReader.on('reader', handleNfcReader);

nfcReader.on('error', err => {
    console.log('NFC error:', err);
});

module.exports = (io) => {
    return nfcReader; // Return nfcReader if needed for other purposes
};

// Define the writeData function
async function writeData(reader, blockNumber, text) {
  try {
      const data = Buffer.from(text, 'utf8'); // Convert text to buffer
      // Write the data to the NFC tag
      await reader.write(blockNumber, data);
      console.log(`Data written to block ${blockNumber}: ${text}`);
  } catch (err) {
      console.error(`Error writing data: ${err.message}`);
  }
}

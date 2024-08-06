const nfc = require('nfc-pcsc'); // Ensure this is the correct NFC library

// Initialize NFC reader
const nfcReader = new nfc.NFC();

let activateWriteData = false; // Control flag for write operations

// Define the writeData function
async function writeData(reader, text) {
  try {
      const data = Buffer.allocUnsafe(20);
      data.fill(0);
      data.write(text); // if text is longer than 12 bytes, it will be cut off
      // reader.write(blockNumber, data, blockSize = 4)
      await reader.write(4, data); // starts writing in block 4, continues to 5 and 6 in order to write 12 bytes
      console.log(`data written`);
  } catch (err) {
      console.error(`error when writing data`, err);
  }
}

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
              await writeData(reader, "1");
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

// Export function to initialize NFC handling with Socket.IO
module.exports = (io) => {
    // Assign io to the module's scope
    global.io = io; // Set io globally or handle accordingly
    return nfcReader; // Return nfcReader if needed for other purposes
};

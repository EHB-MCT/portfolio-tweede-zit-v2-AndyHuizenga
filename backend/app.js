// app.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const nfc = require('nfc-pcsc');
require('dotenv').config(); 


// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
const io = socketIo(server);

// CORS configuration with wildcard
const corsOptions = {
  origin: '*', // Allow requests from any origin
  credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up multer for file uploads


// Use the routes defined in routes/content.js
app.use('/api/content', require('./routes/content'));

// Initialize NFC reader
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

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

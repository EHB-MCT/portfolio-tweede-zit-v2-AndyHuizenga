const path = require('path');
const express = require('express');
const cors = require('cors');
const http = require('http'); // For creating an HTTP server
const socketIo = require('socket.io'); // For WebSocket functionality
require('dotenv').config(); // Load environment variables from .env file
const initializeNfc = require('./services/nfcHandler')

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// API routes
app.use('/api/content', require('./routes/content')); // Example API route for content

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all handler for any other requests - serves the React app's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Create an HTTP server and attach the WebSocket server to it
const server = http.createServer(app);
const io = socketIo(server);

// Conditionally initialize NFC functionality only in local environment
if (process.env.NODE_ENV === 'development') {
  try {
    const initializeNfc = require('./services/nfcHandler');
    initializeNfc(io); // Pass the io instance to the NFC handler
  } catch (error) {
    console.error('Failed to initialize NFC functionality:', error.message);
  }
}


// Initialize WebSocket server with the existing io instance
const initializeWebSocket = require('./services/webSocketHandler');
console.log('Initializing WebSocket server');
initializeWebSocket(io); // Pass the existing io instance

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
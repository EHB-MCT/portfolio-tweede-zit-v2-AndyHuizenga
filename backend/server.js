const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Add this line

dotenv.config();



const app = express();
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
const io = socketIo(server); // Create the socket.io instance

const corsOptions = {
  origin: '*', // Allow requests from any origin
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Catch-all handler for all other routes
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});



app.use('/api/content', require('./routes/content'));

// Conditionally initialize NFC functionality only in local environment
if (process.env.NODE_ENV === 'development') {
  try {
    const initializeNfc = require('./services/nfcHandler');
    initializeNfc(io);
  } catch (error) {
    console.error('Failed to initialize NFC functionality:', error.message);
  }
}

// Initialize WebSocket server with the existing io instance
const initializeWebSocket = require('./services/webSocketHandler');
console.log('Initializing WebSocket server');
initializeWebSocket(io); // Pass the existing io instance

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

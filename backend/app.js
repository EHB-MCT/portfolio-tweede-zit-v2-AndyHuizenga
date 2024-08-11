const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
const io = socketIo(server);

const corsOptions = {
  origin: '*', // Allow requests from any origin
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/content', require('./routes/content'));

// Conditionally initialize NFC functionality only in local environment
if (process.env.NODE_ENV === 'development') {
  const initializeNfc = require('./services/nfcHandler');
  initializeNfc(io);
}

const initializeWebSocket = require('./services/webSocketHandler');
initializeWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

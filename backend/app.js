// app.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const nfcHandler = require('./routes/NfcTag'); // Import NFC handler
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
const io = socketIo(server);

// Initialize NFC handler
nfcHandler(io);

app.use(express.urlencoded({ extended: true }));

app.use('/api/content', require('./routes/content')); // Add your content route

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('tagNumber', (tagNumber) => {
        console.log(`Received tag number: ${tagNumber}`);
        // Handle tag number, possibly broadcast to other clients or update content
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

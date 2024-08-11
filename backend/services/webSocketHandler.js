// services/webSocketHandler.js
function initializeWebSocket(server) {
    const io = require('socket.io')(server);
  
    // Handle WebSocket connections
    io.on('connection', (socket) => {
      console.log('A user connected');
  
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  
    return io;
  }
  
  module.exports = initializeWebSocket;
  
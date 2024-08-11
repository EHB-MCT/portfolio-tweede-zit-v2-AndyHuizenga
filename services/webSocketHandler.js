function initializeWebSocket(io) {
    console.log('Creating WebSocket instance');
  
    // Handle WebSocket connections
    io.on('connection', (socket) => {
      console.log('A user connected');
  
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
}

module.exports = initializeWebSocket;

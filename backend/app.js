const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const sequelize = require('./config/database');
const userRoutes = require('./routes/User');
const nfcRoutes = require('./routes/NfcTag');
const contentRoutes = require('./routes/content');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/nfc', nfcRoutes);
app.use('/api/content', contentRoutes);

// Database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));


 // In your main application file (e.g., app.js)
const sequelize = require('./config/database'); // Adjust path as per your project structure
const User = require('./models/User'); // Adjust path as per your project structure

sequelize.sync({ force: true }) // Use { force: true } carefully; it drops existing tables
  .then(() => {
    console.log('Database synchronized');
    // Start your server or perform other operations after synchronization
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });
 

module.exports = app;

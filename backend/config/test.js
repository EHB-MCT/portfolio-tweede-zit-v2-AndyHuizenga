// test.js

const sequelize = require('./database'); // Assuming sequelize.js is in the same directory

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    sequelize.close(); // Close the connection pool
  }
}

testConnection();

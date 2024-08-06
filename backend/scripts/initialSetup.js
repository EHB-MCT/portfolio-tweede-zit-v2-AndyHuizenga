const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sequelize = require('../config/database');

async function setupInitialData() {
  try {
    await sequelize.authenticate(); // Ensure database connection

    await User.sync();

    // Hash passwords before creating users
    const hashedPasswordUser = await bcrypt.hash('Christine', 10);
    const hashedPasswordAdmin = await bcrypt.hash('admin', 10);

    // Create new users
    await User.bulkCreate([
      {
        username: 'Christine',
        password: hashedPasswordUser,
        role: 'User'
      },
      {
        username: 'admin',
        password: hashedPasswordAdmin,
        role: 'Admin'
      }
    ]);

    console.log('Initial data setup complete.');
  } catch (error) {
    console.error('Error setting up initial data:', error);
  } finally {
    await sequelize.close(); // Close database connection
    process.exit(); // Ensure script exits after execution
  }
}

setupInitialData();

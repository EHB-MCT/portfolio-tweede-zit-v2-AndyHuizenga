// Example Sequelize model definition for User
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('recall_db', 'recall_user', 'admin', {
  host: 'localhost',
  dialect: 'mysql'
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false // Example of a required field
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user' // Example of a default value
  }
}, {
  tableName: 'users', // Make sure this matches your actual table name in MySQL
  timestamps: true, // Optional: Enable timestamps (createdAt, updatedAt)
});

module.exports = User;

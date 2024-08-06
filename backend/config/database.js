const { Sequelize } = require('sequelize');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


console.log(process.env.DB_NAME);   // Should output 'recall_db'
console.log(process.env.DB_USER);   // Should output 'recall_user'
console.log(process.env.DB_PASS);   // Should output 'admin'
console.log(process.env.DB_HOST); 

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql', // Change to 'postgres' if using PostgreSQL
});

module.exports = sequelize;

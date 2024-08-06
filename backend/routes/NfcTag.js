const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NfcTag = sequelize.define('NfcTag', {
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  contentfulEntryId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = NfcTag; // Export NfcTag instead of Nfc

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const User = require('./userModel.js'); 

const VerifiedUsers = sequelize.define('VerifiedUsers', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, 
      key: 'userId', 
    },
    onDelete: 'CASCADE', 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'verifiedusers',
});

module.exports = VerifiedUsers;

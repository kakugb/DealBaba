const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const User = require('./userModel.js'); 

const Deal = sequelize.define('Deal', {  
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
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  shopName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dealName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  timestamps: false,
  tableName: 'deals',  
});

module.exports = Deal;

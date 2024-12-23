const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Deal = require('../models/addDealsModel.js');
const User = require('../models/userModel.js');

const DiscountRequest = sequelize.define('DiscountRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dealId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isApproved: { 
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'discountrequests',
  timestamps: true,
});


DiscountRequest.belongsTo(Deal, { foreignKey: 'dealId' }); 
DiscountRequest.belongsTo(User, { foreignKey: 'userId' }); 

module.exports = DiscountRequest;

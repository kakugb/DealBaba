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
  dealId: { // This will store the deal ID which the customer is requesting a discount for
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isApproved: { // Flag to check if the shop owner has approved the discount
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

// Defining relationships
DiscountRequest.belongsTo(Deal, { foreignKey: 'dealId' }); // DiscountRequest belongs to Deal (dealId)
DiscountRequest.belongsTo(User, { foreignKey: 'userId' }); // DiscountRequest belongs to User (customerId)

module.exports = DiscountRequest;

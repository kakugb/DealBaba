const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const PendingUser = sequelize.define('PendingUser', {
  userId: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    unique: false, 
    allowNull: false 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  role: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  phoneNumber: { 
    type: DataTypes.BIGINT, 
    unique: false, 
    allowNull: false 
  },
  emailOtp: { 
    type: DataTypes.BIGINT, 
    allowNull: false 
  },
  phoneOtp: { 
    type: DataTypes.BIGINT,  
    allowNull: false 
  },
  emailOtpExpiration: { 
    type: DataTypes.DATE, 
    allowNull: true 
  },
  phoneOtpExpiration: { 
    type: DataTypes.DATE, 
    allowNull: true 
  },  
  isEmailVerified: { 
    type: DataTypes.TINYINT, 
    defaultValue: 0 
  },
  isPhoneVerified: { 
    type: DataTypes.TINYINT, 
    defaultValue: 0 
  },
  gender: { 
    type: DataTypes.ENUM('Male', 'Female', 'Other'), 
    allowNull: true 
  },
  isVerified: { 
    type: DataTypes.TINYINT, 
    defaultValue: 0 
  },
}, {
  timestamps: true, 
});

module.exports = PendingUser;

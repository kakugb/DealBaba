const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const User = sequelize.define('User', {
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
    unique: true, 
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
    unique: true, 
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
  isVerified: { 
    type: DataTypes.TINYINT, 
    defaultValue: 0 
  },
  gender: { 
    type: DataTypes.ENUM('Male', 'Female', 'Other'), 
    allowNull: true 
  },
}, {
  tableName: 'users',
  timestamps: true, 
});

module.exports = User;

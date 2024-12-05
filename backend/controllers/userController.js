const User = require('../models/userModel');
const { generateOtp } = require('../utils/otpUtils');
const { sendEmailOtp, sendSmsOtp } = require('../services/otpService');
const { Sequelize } = require('sequelize'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const checkIfUserExists = async (email, phoneNumber) => {
    try {
      return await User.findOne({
        where: {
          [Sequelize.Op.or]: [
            { email },
            { phoneNumber }
          ]
        }
      });
    } catch (err) {
      console.error('Error checking user existence:', err);
      throw new Error('Database error occurred while checking user existence.');
    }
  };

  const createUser = async (req, res) => {
    const { name, email, password, role, phoneNumber, gender } = req.body;
    
    try {
      const existingUser = await checkIfUserExists(email, phoneNumber);
  
      if (existingUser) {
        return res.status(400).json({ message: 'Email or Phone Number already exists' });
      }
  
    
      const emailOtp = generateOtp();
      const phoneOtp = generateOtp();
  
      const otpExpirationTime = new Date(Date.now() + 1 * 60 * 60 * 1000); 
      const formattedOtpExpirationTime = otpExpirationTime.toISOString().slice(0, 19).replace('T', ' '); 
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      try {
        const newUser = await User.create({
          name,
          email,
          password: hashedPassword,
          role,
          phoneNumber,
          gender,
          emailOtp,
          phoneOtp,
          emailOtpExpiration: formattedOtpExpirationTime,  
          phoneOtpExpiration: formattedOtpExpirationTime   
        });
        console.log(' user created Successfully:', newUser);
      } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Server error during user creation', error: error.message });
      }
  
      sendEmailOtp(email, emailOtp,phoneNumber);
      sendSmsOtp(phoneNumber, phoneOtp);
  
      res.status(201).json({ message: 'User created successfully. OTPs have been sent for verification.' });
  
    } catch (err) {
      console.error('Error during signup:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  



  const getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['userId', 'name', 'email', 'role', 'phoneNumber', 'gender', 'createdAt', 'updatedAt'],
        where: {
          role: {
            [Op.or]: ['user', 'customer']
          }
        }
      });
  
      if (!users || users.length === 0) {
        return res.status(404).json({ message: 'No users found with roles "user" or "customer"' });
      }
  
      return res.status(200).json({
        users
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

  
  


  
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      where: { userId: id },
      attributes: ['userId', 'name', 'email', 'role', 'phoneNumber', 'gender']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, phoneNumber, gender } = req.body;

  try {
    const user = await User.findOne({ where: { userId: id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.gender = gender || user.gender;

    await user.save();

    return res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        gender: user.gender
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ where: { userId: id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();

    return res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};



const getUsersByRole = async (req, res) => {
  const { role } = req.query; 

  try {
    if (!role) {
      return res.status(400).json({ message: 'Role is required as a query parameter' });
    }

    
    const validRoles = ['user', 'customer']; 
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role, valid roles are: ${validRoles.join(', ')}` });
    }

    const users = await User.findAll({
      attributes: ['userId', 'name', 'email', 'role', 'phoneNumber', 'gender', 'createdAt', 'updatedAt'],
      where: { role } 
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: `No users found with role "${role}"` });
    }

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};







module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole
};

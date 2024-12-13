const User = require('../models/userModel');
const {DiscountRequest} =require('../models/discountRequest.js')
const VerifiedUsers = require('../models/verifiedUser.js')
const { generateOtp } = require('../utils/otpUtils');
const { sendEmailOtp, sendSmsOtp } = require('../services/otpService');
const { Sequelize } = require('sequelize'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const PendingUsers = require('../models/pendingUsers.js');


  // const createUser = async (req, res) => {
  //   const { name, email, password, role, phoneNumber, gender } = req.body;
    
  //   try {
  //     const existingUser = await checkIfUserExists(email, phoneNumber);
  
  //     if (existingUser) {
  //       return res.status(400).json({ message: 'Email or Phone Number already exists' });
  //     }
  
    
  //     const emailOtp = generateOtp();
  //     const phoneOtp = generateOtp();
  
  //     const otpExpirationTime = new Date(Date.now() + 1 * 60 * 60 * 1000); 
  //     const formattedOtpExpirationTime = otpExpirationTime.toISOString().slice(0, 19).replace('T', ' '); 
  
  //     const hashedPassword = await bcrypt.hash(password, 10);
  
  //     try {
  //       const newUser = await User.create({
  //         name,
  //         email,
  //         password: hashedPassword,
  //         role,
  //         phoneNumber,
  //         gender,
  //         emailOtp,
  //         phoneOtp,
  //         emailOtpExpiration: formattedOtpExpirationTime,  
  //         phoneOtpExpiration: formattedOtpExpirationTime   
  //       });
  //       console.log(' user created Successfully:', newUser);
  //     } catch (error) {
  //       console.error('Error creating user:', error);
  //       return res.status(500).json({ message: 'Server error during user creation', error: error.message });
  //     }
  
  //     sendEmailOtp(email, emailOtp,phoneNumber);
  //     sendSmsOtp(phoneNumber, phoneOtp);
  
  //     res.status(201).json({ message: 'User created successfully. OTPs have been sent for verification.' });
  
  //   } catch (err) {
  //     console.error('Error during signup:', err);
  //     res.status(500).json({ message: 'Server error', error: err.message });
  //   }
  // };
  
  const createUser = async (req, res) => {
    const { name, email, password, role, phoneNumber, gender } = req.body;
  
    try {
      
      const existingUser = await User.findOne({
        where: {
          [Sequelize.Op.or]: [
            { email: email },
            { phoneNumber: phoneNumber }
          ]
        }
      });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Email or Phone Number already exists' });
      }
  
      const emailOtp = generateOtp();
      const phoneOtp = generateOtp();
      const otpExpirationTime = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await PendingUsers.create({
        name,
        email,
        password: hashedPassword,
        role,
        phoneNumber,
        gender,
        emailOtp,
        phoneOtp,
        emailOtpExpiration: otpExpirationTime,
        phoneOtpExpiration: otpExpirationTime,
      });
  
      sendEmailOtp(email, emailOtp, phoneNumber);
      sendSmsOtp(phoneNumber, phoneOtp);
  
      res.status(201).json({ message: 'User created successfully. OTPs have been sent for verification.' });
    } catch (err) {
      console.error('Error during signup:', err);
      res.status(500).json({ message: 'Server error during signup' });
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
  const { name, email, phoneNumber } = req.body;

  try {
    
    console.log('VerifiedUser model:', VerifiedUsers);
    const user = await User.findOne({ where: { userId: id } });
    const verifiedUser = await VerifiedUsers.findOne({ where: { userId: id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

     console.log("vvvvvvvvv", verifiedUser);

     user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;

     await user.save();

     if (verifiedUser) {
      verifiedUser.name = name || verifiedUser.name;
      verifiedUser.email = email || verifiedUser.email;
 
      await verifiedUser.save();
    }

    return res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber
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
    // Log the ID received
    console.log('ID received for deletion:', id);

    // Try to find the user
    const user = await User.findOne({ where: { userId: id } });

    // Check if user exists
    if (!user) {
      console.log('User not found:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);  // Log user object

    // If the user exists, delete them
    await user.destroy();

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error during deletion:', error);
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

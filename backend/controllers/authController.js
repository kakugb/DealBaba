const User = require('../models/userModel');
const { generateOtp } = require('../utils/otpUtils');
const { sendEmailOtp, sendSmsOtp } = require('../services/otpService');
const { Sequelize } = require('sequelize'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');



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

const signup = async (req, res) => {
  const { name, email, password, role, phoneNumber, gender } = req.body;
  
  try {
     const existingUser = await checkIfUserExists(email, phoneNumber);
   
    if (existingUser) {
      return res.status(400).json({ message: 'Email or Phone Number already exists' });
    }

    const emailOtp = generateOtp();
    const phoneOtp = generateOtp();
    const otpExpirationTime = new Date(Date.now() + 10 * 60 * 1000).toISOString();


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
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
   
    sendEmailOtp(email, emailOtp,phoneNumber);
    sendSmsOtp(phoneNumber, phoneOtp);

    res.status(201).json({ message: 'User created successfully. OTPs have been sent for verification.' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};







const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' }); 
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' }); 
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is not verified' });
    }

    if (!user.isPhoneVerified) {
      return res.status(400).json({ message: 'Phone number is not verified' });
    }

    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.userId, name: user.name, email: user.email, role: user.role, gender:user.gender},
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};





const getUserInfo =async(req,res)=>{
  try {
    const user = await User.findByPk(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user); 
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}






module.exports = { signup, login,getUserInfo };


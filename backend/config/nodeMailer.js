const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Hostinger's SMTP server
  port: 465,                 // SMTP port for SSL
  secure: true,              // Use SSL
  auth: {
    user: process.env.EMAIL_USER, // Your Hostinger email (e.g., info@dealbaba.com.au)
    pass: process.env.EMAIL_PASSWORD, // Your Hostinger email password
  },
});

module.exports = transporter;

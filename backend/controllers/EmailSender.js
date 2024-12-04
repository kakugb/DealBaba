const verifiedUser = require('../models/verifiedUser.js');
const generateQRCode = require('./qrCodeGenrator.js')


const path = require('path');
const transporter = require('../config/nodeMailer'); 

const sendQRCodeEmail = async (req, res) => {
  const { userId } = req.body; 
  try {
  
    const user = await verifiedUser.findOne({ where: { userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  
    const { name, email } = user;

    console.log('Sending email to:', email);

    const qrData = `User: ${name}, Email: ${email}`;

    const qrFilename = 'qr_code.png';


    const qrFilePath = await generateQRCode(qrData, qrFilename);

    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your QR Code',
      text: 'Here is your QR code for verification.',
      attachments: [
        {
          filename: qrFilename,
          path: qrFilePath, 
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent successfully:', info.response);
        return res.status(200).json({ message: 'QR Code email sent successfully' });
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = sendQRCodeEmail;

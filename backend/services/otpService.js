const twilioClient = require('../config/twillio');

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "karamat.4101@gmail.com", 
    pass: "cgak ftso ilnu wqnx", 
  },
});

const sendEmailOtp = async (email, verificationCode,phoneNumber) => {
  
  const mailOptions = {
    from: "karamat.4101@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Your OTP is: ${verificationCode}. Please verify here: http://localhost:5173/otp?email=${email}&phoneNumber=${phoneNumber}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Unable to send verification email");
  }
};





function sendSmsOtp(phoneNumber, otp) {
  twilioClient.messages.create({
    body: `Your OTP for phone verification is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER || `+17753477287`,
    to: phoneNumber
  }).catch((err) => {
    console.error('Error sending OTP SMS:', err);
  });
}

module.exports = {
  sendEmailOtp,
  sendSmsOtp
};

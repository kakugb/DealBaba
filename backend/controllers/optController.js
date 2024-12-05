const User = require('../models/userModel.js');
const VerifiedUsers= require('../models/verifiedUser.js');
const { sendEmailOtp, sendSmsOtp } = require('../services/otpService.js');
const generateOtp = () => Math.floor(100000 + Math.random() * 900000); 


exports.sendOtp = async (req, res) => {
  const { email, phoneNumber, type } = req.body;

  try {
    let user;
    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (phoneNumber) {
      user = await User.findOne({ where: { phone: phoneNumber } });
    }

    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.isVerified) {
      return res.status(400).json({ message: 'You are already a verified user.' });
    }

    
    const otp = generateOtp();
    const expirationTime = Date.now() + 10 * 60 * 1000;  

   
    if (type === 'email') {
      user.emailOtp = otp;
      user.emailOtpExpiration = expirationTime; 
      await sendEmailOtp(user.email, otp); 
    } else if (type === 'phone') {
      user.phoneOtp = otp;
      user.phoneOtpExpiration = expirationTime;  
      await sendSmsOtp(user.phone, otp);  
    }

   
    await user.save();

    res.status(200).json({ message: `${type} OTP sent successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
};




exports.verifyOtp = async (req, res) => {
  
  const {  email, phoneNumber, otp, type } = req.body;
 
  try {
    let user;
    
    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (phoneNumber) {
      user = await User.findOne({ where: { phoneNumber } });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
     const userId = user.userId;
     const otpExpirationTime = type === 'email' ? user.emailOtpExpiration : user.phoneOtpExpiration;
     const expirationTimestamp = new Date(otpExpirationTime).getTime();

;


if (Date.now() > expirationTimestamp) {
  return res.status(400).json({ message: 'OTP has expired.' });
}
   
    if (String(otp) === String(user[type === 'email' ? 'emailOtp' : 'phoneOtp'])) {
   
      if (type === 'email') {
        user.isEmailVerified = true;
      } else if (type === 'phone') {
        user.isPhoneVerified = true;
      }

      user.isVerified = user.isEmailVerified && user.isPhoneVerified;
      await user.save();
  
      if (user.isVerified && user.role==='customer') {
        
        await VerifiedUsers.create({
          userId:userId,
          name: user.name,
          email: user.email
        });

     
        user.emailOtp = null;
        user.phoneOtp = null;
        user.emailOtpExpiration = null;
        user.phoneOtpExpiration = null;
        await user.save();

        return res.status(200).json({ message: 'Both OTPs verified successfully, user details stored in VerifiedUsers table.' });
      }

      return res.status(200).json({ message: `${type} OTP verified successfully.` });
    }

    res.status(400).json({ message: 'Invalid OTP.' });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ message: 'Server error during OTP verification', error: err.message });
  }
};





exports.verifyOtps = async (req, res) => {
  let { otpEmail, otpPhone, email, phoneNumber } = req.body;
  phoneNumber = phoneNumber.replace(/\s+/g, ''); 
  if (!phoneNumber.startsWith('+')) {
    phoneNumber = '+' + phoneNumber; 
  }

  

  try {
    const user = await User.findOne({
      where: {
        email: email.trim(),       
        phoneNumber: phoneNumber   
      }
    });

 

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    otpEmail = parseInt(otpEmail, 10);
    otpPhone = parseInt(otpPhone, 10);

    const isEmailOtpValid = user.emailOtp === otpEmail;
    const isPhoneOtpValid = user.phoneOtp === otpPhone;

    

    if (isEmailOtpValid && isPhoneOtpValid) {
      
      user.isEmailVerified = true;
      user.isPhoneVerified = true;
      user.isVerified = true;
      await user.save();
      if (user.isVerified && user.role==='customer') {
        
        await VerifiedUsers.create({
          userId:user.userId,
          name: user.name,
          email: user.email
        });

     
      

      }

      return res.json({ message: 'Both OTPs verified successfully', isVerified: true });
    } else {
    
      return res.status(400).json({ message: 'Invalid OTP(s)' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};





      exports.verifyUser = async (req, res) => {
        try {
          const { name, email } = req.body;
          const loggedInUserEmail = req.User?.email; 
          console.log(name,loggedInUserEmail,email)
          
          if (!name || !email) {
            return res.status(400).json({ message: "User and email are required." });
          }
      
          if (!loggedInUserEmail) {
            return res.status(400).json({ message: "Logged-in user email not found." });
          }
      
          if (email !== loggedInUserEmail) {
            return res.status(403).json({ message: "QR code email does not match the logged-in user." });
          }
      
          const verifiedUser = await VerifiedUsers.findOne({ name, email });
       console.log(verifiedUser)
          if (verifiedUser) {
            return res.status(200).json({ isVerified: true, message: "User is verified." });
          } else {
            return res.status(404).json({ isVerified: false, message: "User not found in verified users." });
          }
        } catch (error) {
          console.error("Error verifying user:", error);
          return res.status(500).json({
            message: "Internal server error.",
            error: error.message, 
          });
        }
        
      };
      
      
      
      










const express = require('express');
const router = express.Router();

const { signup,login ,getUserInfo} = require('../controllers/authController.js'); 
const { sendOtp, verifyOtp,verifyOtps,verifyUser } = require('../controllers/optController.js');

const generateQRCode = require('../controllers/qrCodeGenrator.js')
const authenticateToken = require('../middlewares/authMiddleware.js');
const auth = require('../middlewares/userInfoMiddleware'); 
const authsMiddleware =require('../middlewares/authsMiddleware.js')
router.post('/signup', signup);

router.post('/login', login);

router.post('/verify', verifyOtp);

router.post('/verified', verifyOtps);

router.get('/user', auth,getUserInfo);

router.get('/generateQR', authenticateToken, generateQRCode);

router.post("/verify-user",authsMiddleware, verifyUser);
module.exports = router;

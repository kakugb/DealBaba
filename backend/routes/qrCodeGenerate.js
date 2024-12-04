const express = require('express');
const sendQRCodeEmail = require('../controllers/EmailSender.js'); 

const router = express.Router();

router.post('/send-qrcode', sendQRCodeEmail);

module.exports = router;


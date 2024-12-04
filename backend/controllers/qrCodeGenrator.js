const QRCode = require('qrcode');
const path = require('path');

const generateQRCode = (data, filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '..', 'public', filename);
    QRCode.toFile(filePath, data, (err) => {
      if (err) {
        reject('Error generating QR code: ' + err);
      } else {
        resolve(filePath);
      }
    });
  });
};

module.exports = generateQRCode; 

const multer = require('multer');
const path = require('path');

// Export configured multer instance
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'), // Destination folder
    filename: (req, file, cb) => {
      const filename = Date.now() + '-' + file.originalname; // Generate filename
      cb(null, filename); // Store only the filename
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload; // Export the multer instance

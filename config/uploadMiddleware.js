const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const upload = multer({
  dest: 'uploads/', // Directory to save the uploaded files
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit file size to 10MB (adjust as needed)
  },
  fileFilter: (req, file, cb) => {
    // Optionally filter file types
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4']; // Add more as needed
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

module.exports = upload;

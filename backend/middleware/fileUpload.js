// backend/middleware/fileUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedName = (file.originalname || 'resume.pdf').replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  }
});

// File filter: strictly allow only PDF files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf'];
  const ext = path.extname(file.originalname || '').toLowerCase();

  // Validate both MIME type and file extension
  if (allowedMimeTypes.includes(file.mimetype) && ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF documents (.pdf) are allowed.'), false);
  }
};

// 5MB max file size limit
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES
  },
  fileFilter
});

/**
 * Express middleware wrapper to catch Multer errors and format friendly responses
 */
const uploadResumeMiddleware = (req, res, next) => {
  const uploadSingle = upload.single('resume');

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size exceeds 5MB limit. Please upload a PDF smaller than 5MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Invalid file uploaded. Only PDF documents are supported.'
      });
    }

    // Check if file is provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file provided. Please upload a PDF file.'
      });
    }

    next();
  });
};

module.exports = {
  uploadResume: upload,
  uploadResumeMiddleware
};

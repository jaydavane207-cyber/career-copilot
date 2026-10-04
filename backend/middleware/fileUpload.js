// backend/middleware/fileUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration with required filename format: ${userId}_${Date.now()}.pdf
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id || 'anon';
    cb(null, `${userId}_${Date.now()}.pdf`);
  }
});

// File filter: strictly allow only PDF files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf'];
  const ext = path.extname(file.originalname || '').toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF documents (.pdf) are allowed.'), false);
  }
};

// 5MB max file size limit (5242880 bytes)
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES
  },
  fileFilter
});

/**
 * Universal upload middleware handling either 'resume' or 'file' form fields
 */
const uploadResumeMiddleware = (req, res, next) => {
  // Support both 'resume' and 'file' field names seamlessly
  const multiFieldHandler = upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]);

  multiFieldHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'FILE_TOO_LARGE',
          message: 'File size exceeds 5MB limit. Please upload a PDF smaller than 5MB.'
        });
      }
      return res.status(400).json({
        success: false,
        error: err.code,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_FILE',
        message: err.message || 'Invalid file uploaded. Only PDF documents are supported.'
      });
    }

    // Assign req.file from either 'resume' or 'file'
    if (req.files) {
      if (req.files.resume && req.files.resume[0]) {
        req.file = req.files.resume[0];
      } else if (req.files.file && req.files.file[0]) {
        req.file = req.files.file[0];
      }
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'FILE_MISSING',
        message: 'No resume file provided. Please upload a PDF file.'
      });
    }

    next();
  });
};

module.exports = {
  upload,
  uploadResume: upload,
  uploadResumeMiddleware,
  fileUpload: uploadResumeMiddleware
};

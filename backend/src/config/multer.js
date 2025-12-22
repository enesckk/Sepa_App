const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Uploads klasörünü oluştur
const uploadsDir = path.join(__dirname, '../../uploads');
const applicationsDir = path.join(uploadsDir, 'applications');
const billsDir = path.join(uploadsDir, 'bills');
const storiesDir = path.join(uploadsDir, 'stories');
const eventsDir = path.join(uploadsDir, 'events');
const newsDir = path.join(uploadsDir, 'news');
const rewardsDir = path.join(uploadsDir, 'rewards');

[uploadsDir, applicationsDir, billsDir, storiesDir, eventsDir, newsDir, rewardsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Route'a göre klasör seç
    if (req.path.includes('/applications')) {
      cb(null, applicationsDir);
    } else if (req.path.includes('/bill-supports')) {
      cb(null, billsDir);
    } else if (req.path.includes('/stories')) {
      cb(null, storiesDir);
    } else if (req.path.includes('/events') || req.path.includes('/admin/events')) {
      cb(null, eventsDir);
    } else if (req.path.includes('/news') || req.path.includes('/admin/news')) {
      cb(null, newsDir);
    } else if (req.path.includes('/rewards') || req.path.includes('/admin/rewards')) {
      cb(null, rewardsDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    // Dosya adı: timestamp-random-originalname
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// File filter - sadece resim dosyaları
const fileFilter = (req, file, cb) => {
  // İzin verilen dosya tipleri
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
      ),
      false
    );
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Single file upload middleware
const uploadSingle = (fieldName = 'image') => {
  return upload.single(fieldName);
};

// Multiple files upload middleware (optional, for future use)
const uploadMultiple = (fieldName = 'images', maxCount = 5) => {
  return upload.array(fieldName, maxCount);
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadsDir,
  applicationsDir,
  billsDir,
  storiesDir,
  eventsDir,
  newsDir,
  rewardsDir,
};


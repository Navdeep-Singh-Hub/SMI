const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth.middleware');

const KYC_DIR = path.join(__dirname, '..', '..', 'uploads', 'kyc');
if (!fs.existsSync(KYC_DIR)) {
  fs.mkdirSync(KYC_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, KYC_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const safe = file.fieldname.replace(/[^a-z0-9]/gi, '_');
    cb(null, `${req.userId}_${safe}_${Date.now()}${ext}`);
  }
});

const fileFilter = (_req, file, cb) => {
  const ok = /^image\/(jpeg|jpg|png|webp)$/i.test(file.mimetype);
  if (ok) cb(null, true);
  else cb(new Error('Only JPEG, PNG, or WebP images are allowed'), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter
});

const kycFields = upload.fields([
  { name: 'aadhaarFront', maxCount: 1 },
  { name: 'aadhaarBack', maxCount: 1 },
  { name: 'holdingPhoto', maxCount: 1 }
]);

// POST /api/user/kyc/submit — multipart: aadhaarFront, aadhaarBack, holdingPhoto
router.post('/submit', authMiddleware, (req, res) => {
  kycFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (user.kycStatus === 'pending') {
        return res.status(400).json({ message: 'KYC is already under review. Please wait for approval.' });
      }
      if (user.kycStatus === 'approved') {
        return res.status(400).json({ message: 'KYC is already approved.' });
      }

      const f = req.files || {};
      const front = f.aadhaarFront?.[0];
      const back = f.aadhaarBack?.[0];
      const hold = f.holdingPhoto?.[0];

      if (!front || !back || !hold) {
        return res.status(400).json({
          message: 'All three documents are required: Aadhaar front, Aadhaar back, and photo holding Aadhaar.'
        });
      }

      user.kycAadhaarFront = front.filename;
      user.kycAadhaarBack = back.filename;
      user.kycHoldingPhoto = hold.filename;
      user.kycStatus = 'pending';
      user.kycSubmittedAt = new Date();
      user.kycRejectedReason = '';
      await user.save();

      res.status(201).json({
        message: 'KYC documents submitted successfully. They will be reviewed for approval.',
        kycStatus: user.kycStatus
      });
    } catch (e) {
      console.error('KYC submit error:', e);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// GET /api/user/kyc/status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      'kycStatus kycSubmittedAt kycRejectedReason kycAadhaarFront kycAadhaarBack kycHoldingPhoto'
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      kycStatus: user.kycStatus,
      kycSubmittedAt: user.kycSubmittedAt,
      kycRejectedReason: user.kycRejectedReason || '',
      documentsSubmitted: !!(
        user.kycAadhaarFront &&
        user.kycAadhaarBack &&
        user.kycHoldingPhoto
      )
    });
  } catch (e) {
    console.error('KYC status error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

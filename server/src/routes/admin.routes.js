const router = require('express').Router();
const User = require('../models/User');

const ADMIN_KEY = process.env.ADMIN_API_KEY;

function adminAuth(req, res, next) {
  const key = req.headers['x-admin-key'] || req.body?.adminKey;
  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}

// POST /api/admin/kyc/decision  { userId, action: "approve" | "reject", reason? }
router.post('/kyc/decision', adminAuth, async (req, res) => {
  try {
    const { userId, action, reason } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (action === 'approve') {
      user.kycStatus = 'approved';
      user.kycRejectedReason = '';
    } else if (action === 'reject') {
      user.kycStatus = 'rejected';
      user.kycRejectedReason = (reason && String(reason).trim()) || 'Rejected. Please resubmit.';
    } else {
      return res.status(400).json({ message: 'action must be "approve" or "reject"' });
    }
    await user.save();
    res.json({ message: 'Updated', kycStatus: user.kycStatus });
  } catch (e) {
    console.error('Admin KYC decision error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

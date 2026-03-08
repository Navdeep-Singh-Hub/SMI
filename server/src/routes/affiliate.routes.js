const router = require('express').Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/auth.middleware');

const COMMISSION_RATE = 10;
const FRONTEND_URL = process.env.FRONTEND_URL || '';

// GET /api/affiliate/me - Referral link and code for current user (generates code if missing)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { ensureReferralCode } = require('../middleware/auth.middleware');
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const code = await ensureReferralCode(user);
    const base = FRONTEND_URL || (req.get('origin') || '').replace(/\/$/, '');
    const referralLink = base ? `${base}/register?ref=${code}` : `${req.protocol}://${req.get('host') || ''}/register?ref=${code}`;
    res.json({ referralLink, referralCode: code });
  } catch (error) {
    console.error('Get affiliate me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/affiliate/attach-referrer - Set who referred this user (from ?ref= in URL, call after login)
router.post('/attach-referrer', authMiddleware, async (req, res) => {
  try {
    const { referralCode } = req.body;
    if (!referralCode || typeof referralCode !== 'string') {
      return res.status(400).json({ message: 'referralCode is required' });
    }
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.referredBy) {
      return res.json({ message: 'Already referred', attached: false });
    }
    const referrer = await User.findOne({ referralCode: referralCode.trim().toUpperCase() });
    if (!referrer) return res.status(404).json({ message: 'Invalid referral code' });
    if (referrer._id.toString() === req.userId) {
      return res.status(400).json({ message: 'Cannot use your own referral code' });
    }
    user.referredBy = referrer._id;
    await user.save();
    res.json({ message: 'Referrer attached', attached: true });
  } catch (error) {
    console.error('Attach referrer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/affiliate/stats - Real stats from DB
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const totalReferrals = await User.countDocuments({ referredBy: userId });
    const commissionTxns = await Transaction.find({ user: userId, type: 'commission' }).lean();
    const totalCommissions = commissionTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
    res.json({
      totalReferrals,
      activeReferrals: totalReferrals,
      totalCommissions: Math.round(totalCommissions * 100) / 100,
      pendingCommissions: 0,
      commissionRate: COMMISSION_RATE
    });
  } catch (error) {
    console.error('Get affiliate stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/affiliate/referrals - List referred users with invested total
router.get('/referrals', authMiddleware, async (req, res) => {
  try {
    const referred = await User.find({ referredBy: req.userId })
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .lean();
    const referrals = await Promise.all(
      referred.map(async (u) => {
        const invested = await Transaction.aggregate([
          { $match: { user: u._id, type: 'investment', status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        return {
          id: u._id,
          name: u.name,
          email: u.email,
          date: u.createdAt,
          status: 'active',
          invested: (invested[0] && invested[0].total) || 0
        };
      })
    );
    res.json({ referrals });
  } catch (error) {
    console.error('Get referrals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/affiliate/commissions - Commission history
router.get('/commissions', authMiddleware, async (req, res) => {
  try {
    const list = await Transaction.find({ user: req.userId, type: 'commission' })
      .sort({ createdAt: -1 })
      .lean();
    res.json({
      commissions: list.map((c) => ({
        id: c._id,
        amount: c.amount,
        type: c.description || 'Commission',
        date: c.createdAt,
        status: c.status || 'paid'
      }))
    });
  } catch (error) {
    console.error('Get commissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

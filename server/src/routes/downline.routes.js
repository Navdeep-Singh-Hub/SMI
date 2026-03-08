const router = require('express').Router();
const authMiddleware = require('../middleware/auth.middleware');

// GET /api/downline/stats - Downline stats (zeros for new users until referral system is built)
router.get('/stats', authMiddleware, async (_req, res) => {
  try {
    res.json({
      totalMembers: 0,
      directReferrals: 0,
      level2Referrals: 0,
      level3Referrals: 0,
      totalInvested: 0,
      totalCommissions: 0
    });
  } catch (error) {
    console.error('Get downline stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/downline/network - Downline network tree (empty for new users)
router.get('/network', authMiddleware, async (_req, res) => {
  try {
    res.json({ network: [] });
  } catch (error) {
    console.error('Get downline network error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const router = require('express').Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/auth.middleware');

// GET /api/user/balance - Get current user balance, wallet, and profit
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('balance wallet');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const depositTxns = await Transaction.find({
      user: req.userId,
      type: 'deposit',
      status: 'completed'
    }).select('amount');
    const totalDeposits = depositTxns.reduce((sum, t) => sum + t.amount, 0);

    const balance = Number(user.balance) || 0;
    const wallet = Number(user.wallet) || 0;
    const profit = (balance + wallet) - totalDeposits;

    res.json({
      balance: Number(balance),
      wallet: Number(wallet),
      profit: Math.round(profit * 100) / 100
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

function profilePayload(user) {
  const phone = (user.phone && String(user.phone).trim()) || '';
  const address = (user.address && String(user.address).trim()) || '';
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone,
    address,
    balance: user.balance || 0,
    wallet: user.wallet || 0,
    profileComplete: !!(phone && address),
    kycStatus: user.kycStatus || 'none',
    kycSubmittedAt: user.kycSubmittedAt,
    kycRejectedReason: user.kycRejectedReason || '',
    createdAt: user.createdAt
  };
}

// GET /api/user/profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select(
        'name username email phone address balance wallet createdAt kycStatus kycSubmittedAt kycRejectedReason kycAadhaarFront kycAadhaarBack kycHoldingPhoto'
      )
      .populate('transactions', 'type amount status createdAt', null, { sort: { createdAt: -1 }, limit: 10 });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const base = profilePayload(user);
    res.json({
      ...base,
      recentTransactions: user.transactions || [],
      kycFiles: {
        aadhaarFront: user.kycAadhaarFront || '',
        aadhaarBack: user.kycAadhaarBack || '',
        holdingPhoto: user.kycHoldingPhoto || ''
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/user/profile — phone, address, username (unique)
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const { phone, address, username } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (phone !== undefined) user.phone = String(phone).trim();
    if (address !== undefined) user.address = String(address).trim();

    if (username !== undefined && String(username).trim()) {
      const next = String(username).trim().toLowerCase();
      if (next !== user.username) {
        const taken = await User.findOne({ username: next, _id: { $ne: user._id } });
        if (taken) {
          return res.status(400).json({ message: 'Username is already taken' });
        }
        user.username = next;
      }
    }

    await user.save();
    res.json(profilePayload(user));
  } catch (error) {
    console.error('Patch profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

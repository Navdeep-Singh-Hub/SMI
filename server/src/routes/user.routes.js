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

    // Calculate profit from transactions
    // Profit = Total earnings (investments + commissions) - Total deposits
    const transactions = await Transaction.find({ 
      user: req.userId,
      status: 'completed'
    }).select('type amount');

    let totalDeposits = 0;
    let totalEarnings = 0;

    transactions.forEach(txn => {
      if (txn.type === 'deposit') {
        totalDeposits += txn.amount;
      } else if (txn.type === 'investment' || txn.type === 'commission') {
        totalEarnings += txn.amount;
      }
    });

    const profit = totalEarnings - totalDeposits;

    res.json({
      balance: user.balance || 0,
      wallet: user.wallet || 0,
      profit: profit || 0
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/user/profile - Get user profile with balance
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('name username email balance wallet createdAt')
      .populate('transactions', 'type amount status createdAt', null, { sort: { createdAt: -1 }, limit: 10 });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      balance: user.balance || 0,
      wallet: user.wallet || 0,
      recentTransactions: user.transactions || [],
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



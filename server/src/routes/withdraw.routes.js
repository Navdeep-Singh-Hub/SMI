const router = require('express').Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth.middleware');

const MIN_WITHDRAWAL = 50;

// POST /api/withdraw/create - Create withdrawal request
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { amount, payMethod, cryptoCurrency, cryptoAddress } = req.body;
    const userId = req.userId;

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < MIN_WITHDRAWAL) {
      return res.status(400).json({
        message: `Minimum withdrawal amount is $${MIN_WITHDRAWAL}`
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.balance < withdrawAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    if (user.kycStatus !== 'approved') {
      return res.status(403).json({
        message:
          'KYC verification is required before withdrawal. Complete KYC in Profile and wait for approval.',
        kycRequired: true,
        kycStatus: user.kycStatus || 'none'
      });
    }

    if (!(user.phone && String(user.phone).trim()) || !(user.address && String(user.address).trim())) {
      return res.status(403).json({
        message: 'Please complete your profile (phone and address) in Profile before withdrawing.',
        profileIncomplete: true
      });
    }

    const method = payMethod === 'bank' ? 'bank' : 'crypto';
    if (method === 'crypto' && !(cryptoAddress && cryptoAddress.trim())) {
      return res.status(400).json({ message: 'Crypto wallet address is required' });
    }

    const transaction = await Transaction.create({
      user: userId,
      type: 'withdrawal',
      amount: withdrawAmount,
      status: 'pending',
      payMethod: method,
      cryptoCurrency: method === 'crypto' ? (cryptoCurrency || 'btc') : undefined,
      cryptoAddress: method === 'crypto' ? cryptoAddress.trim() : undefined,
      description: method === 'crypto'
        ? `Withdraw $${withdrawAmount.toFixed(2)} to ${cryptoCurrency || 'crypto'}`
        : `Withdraw $${withdrawAmount.toFixed(2)} (bank)`
    });

    user.balance -= withdrawAmount;
    user.transactions.push(transaction._id);
    await user.save();

    res.status(201).json({
      message: 'Withdrawal request submitted successfully',
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        status: transaction.status,
        payMethod: transaction.payMethod,
        createdAt: transaction.createdAt
      }
    });
  } catch (error) {
    console.error('Create withdrawal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/withdraw/history - List user's withdrawals
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const withdrawals = await Transaction.find({
      user: req.userId,
      type: 'withdrawal'
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      withdrawals: withdrawals.map((w) => ({
        id: w._id,
        amount: w.amount,
        status: w.status,
        method: w.payMethod === 'bank' ? 'Bank Transfer' : 'Crypto',
        cryptoCurrency: w.cryptoCurrency,
        date: w.createdAt,
        transactionId: `WD-${w._id.toString().slice(-8).toUpperCase()}`
      }))
    });
  } catch (error) {
    console.error('Withdrawal history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

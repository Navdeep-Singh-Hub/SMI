const router = require('express').Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth.middleware');

// POST /api/invest/create - Create a new investment
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { planName, amount } = req.body;

    if (!planName || !amount) {
      return res.status(400).json({ message: 'Plan name and amount are required' });
    }

    const investmentAmount = parseFloat(amount);
    if (isNaN(investmentAmount) || investmentAmount <= 0) {
      return res.status(400).json({ message: 'Invalid investment amount' });
    }

    // Check if user is trying to purchase Demo Plan
    if (planName === 'Demo Plan') {
      // Check if user has already purchased Demo Plan
      const existingDemoInvestment = await Transaction.findOne({
        user: req.userId,
        type: 'investment',
        planName: 'Demo Plan',
        status: { $in: ['pending', 'completed'] } // Check both pending and completed
      });

      if (existingDemoInvestment) {
        return res.status(403).json({ 
          message: 'Demo Plan can only be purchased once per user',
          alreadyPurchased: true
        });
      }
    }

    // Get user to check balance
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate plan amounts (basic validation - you may want to fetch from a plans collection)
    const planLimits = {
      'Demo Plan': { min: 50, max: 499 },
      'Bronze': { min: 500, max: 1999 },
      'Silver': { min: 2000, max: 9999 },
      'Gold': { min: 10000, max: 49999 },
      'Platinum': { min: 50000, max: 999999 }
    };

    const plan = planLimits[planName];
    if (!plan) {
      return res.status(400).json({ message: 'Invalid plan name' });
    }

    if (investmentAmount < plan.min || investmentAmount > plan.max) {
      return res.status(400).json({ 
        message: `Amount must be between $${plan.min} and $${plan.max}` 
      });
    }

    // Check if user has sufficient balance
    if (user.balance < investmentAmount) {
      return res.status(400).json({ 
        message: 'Insufficient balance. Please deposit funds first.' 
      });
    }

    // Create investment transaction
    const transaction = await Transaction.create({
      user: req.userId,
      type: 'investment',
      amount: investmentAmount,
      planName: planName,
      status: 'completed', // Auto-complete investment (or set to 'pending' if you want manual approval)
      description: `Investment in ${planName} plan`
    });

    // Deduct from balance
    user.balance -= investmentAmount;
    await user.save();

    // Add transaction to user's transactions array
    user.transactions.push(transaction._id);
    await user.save();

    res.status(201).json({
      message: 'Investment created successfully',
      transaction: {
        id: transaction._id,
        planName: transaction.planName,
        amount: transaction.amount,
        status: transaction.status,
        createdAt: transaction.createdAt
      }
    });
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/invest/check-demo - Check if user has already purchased Demo Plan
router.get('/check-demo', authMiddleware, async (req, res) => {
  try {
    const existingDemoInvestment = await Transaction.findOne({
      user: req.userId,
      type: 'investment',
      planName: 'Demo Plan',
      status: { $in: ['pending', 'completed'] }
    });

    res.json({
      hasPurchasedDemoPlan: !!existingDemoInvestment
    });
  } catch (error) {
    console.error('Check demo plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/invest/active - Get user's active investments
router.get('/active', authMiddleware, async (req, res) => {
  try {
    const investments = await Transaction.find({
      user: req.userId,
      type: 'investment',
      status: { $in: ['pending', 'completed'] }
    }).sort({ createdAt: -1 });

    res.json({
      investments: investments.map(inv => ({
        id: inv._id,
        planName: inv.planName,
        amount: inv.amount,
        status: inv.status,
        createdAt: inv.createdAt
      }))
    });
  } catch (error) {
    console.error('Get active investments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


const router = require('express').Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth.middleware');

// POST /api/invest/create - Create a new investment
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { planName, amount, preLaunch } = req.body;

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

    // Validate plan amounts and get plan terms
    const planConfig = {
      'Demo Plan': { min: 50, max: 499, dailyReturn: 2.5, durationDays: 7 },
      'Bronze': { min: 500, max: 1999, dailyReturn: 3.0, durationDays: 14 },
      'Silver': { min: 2000, max: 9999, dailyReturn: 3.5, durationDays: 21 },
      'Gold': { min: 10000, max: 49999, dailyReturn: 4.0, durationDays: 30 },
      'Platinum': { min: 50000, max: 999999, dailyReturn: 5.0, durationDays: 30 }
    };

    const plan = planConfig[planName];
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

    const isPreLaunch = preLaunch === true || preLaunch === 'true';
    const preLaunchMultiplier = isPreLaunch ? 4 : 1;

    // Create investment transaction with plan terms
    const transaction = await Transaction.create({
      user: req.userId,
      type: 'investment',
      amount: investmentAmount,
      planName: planName,
      planDailyReturn: plan.dailyReturn,
      planDurationDays: plan.durationDays,
      preLaunch: isPreLaunch,
      preLaunchMultiplier,
      status: 'completed',
      description: isPreLaunch
        ? `Pre-launch staking (4X offer) — ${planName} plan`
        : `Investment in ${planName} plan`
    });

    // Deduct from balance
    user.balance -= investmentAmount;
    await user.save();

    // Add transaction to user's transactions array
    user.transactions.push(transaction._id);
    await user.save();

    // Commission for referrer (10% of investment)
    const referrerId = user.referredBy;
    if (referrerId) {
      const commissionRate = 0.1;
      const commissionAmount = Math.round(investmentAmount * commissionRate * 100) / 100;
      const commissionTxn = await Transaction.create({
        user: referrerId,
        type: 'commission',
        amount: commissionAmount,
        status: 'completed',
        description: `Commission from ${planName} investment (${user.name || user.email})`
      });
      const referrer = await User.findById(referrerId);
      if (referrer) {
        referrer.wallet = (referrer.wallet || 0) + commissionAmount;
        referrer.transactions.push(commissionTxn._id);
        await referrer.save();
      }
    }

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

// GET /api/invest/active - Get user's active investments with computed earnings
router.get('/active', authMiddleware, async (req, res) => {
  try {
    const investments = await Transaction.find({
      user: req.userId,
      type: 'investment',
      status: { $in: ['pending', 'completed'] }
    }).sort({ createdAt: -1 });

    const now = new Date();
    const investmentsWithEarnings = investments.map(inv => {
      const startDate = new Date(inv.createdAt);
      const durationDays = inv.planDurationDays || 7;
      const dailyReturn = inv.planDailyReturn || 2.5;
      const mult = inv.preLaunchMultiplier && inv.preLaunchMultiplier > 1 ? inv.preLaunchMultiplier : 1;
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durationDays);
      const daysElapsed = Math.floor((now - startDate) / (24 * 60 * 60 * 1000));
      const daysRemaining = Math.max(0, durationDays - daysElapsed);
      const baseDaily = (inv.amount * dailyReturn) / 100;
      const dailyEarning = baseDaily * mult;
      const totalEarned = dailyEarning * Math.min(daysElapsed, durationDays);
      return {
        id: inv._id,
        plan: inv.planName,
        amount: inv.amount,
        dailyReturn,
        effectiveDailyReturn: Math.round(dailyReturn * mult * 1000) / 1000,
        preLaunch: !!inv.preLaunch,
        preLaunchMultiplier: mult,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        daysRemaining,
        totalEarned: Math.round(totalEarned * 100) / 100,
        status: inv.status
      };
    });

    res.json({
      investments: investmentsWithEarnings
    });
  } catch (error) {
    console.error('Get active investments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


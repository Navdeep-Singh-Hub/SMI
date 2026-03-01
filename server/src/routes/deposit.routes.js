const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth.middleware');
const nowpaymentsService = require('../services/nowpayments.service');

// Helper function to update user balance
const updateUserBalance = async (userId, amount) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.balance += amount;
  await user.save();
  return user.balance;
};

// POST /api/deposit/create - Create deposit request with NOWPayments
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { amount, payCurrency } = req.body;
    const userId = req.userId;

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: 'Invalid amount. Amount must be greater than 0' });
    }

    const depositAmount = parseFloat(amount);
    const orderId = `deposit_${userId}_${Date.now()}`;
    const orderDescription = `Deposit of $${depositAmount.toFixed(2)}`;

    // Create transaction first
    const transaction = await Transaction.create({
      user: userId,
      type: 'deposit',
      amount: depositAmount,
      status: 'pending',
      description: orderDescription
    });

    // Add transaction to user
    await User.findByIdAndUpdate(userId, {
      $push: { transactions: transaction._id }
    });

    try {
      // Create NOWPayments payment (with selected cryptocurrency if provided)
      const paymentData = await nowpaymentsService.createPayment(
        depositAmount,
        transaction._id.toString(),
        orderDescription,
        payCurrency // Pass selected cryptocurrency
      );

      // Update transaction with NOWPayments data
      transaction.nowpaymentsPaymentId = paymentData.payment_id;
      transaction.nowpaymentsInvoiceUrl = paymentData.invoice_url;
      transaction.nowpaymentsQrCode = paymentData.qr_code || paymentData.qrCode;
      transaction.cryptoCurrency = paymentData.pay_currency;
      transaction.cryptoAmount = paymentData.pay_amount;
      await transaction.save();

      // Generate QR code from payment address if NOWPayments didn't provide one
      let qrCodeUrl = paymentData.qr_code || paymentData.qrCode;
      if (!qrCodeUrl && paymentData.pay_address) {
        // Use a QR code generation service to create QR from payment address
        const paymentAddress = paymentData.pay_address;
        // For TRC20/ERC20, we can use the address directly or create a payment URI
        // Simple approach: QR code with just the address
        qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(paymentAddress)}`;
        console.log('Generated QR code from payment address:', paymentAddress);
      }

      console.log('QR Code URL:', qrCodeUrl);
      console.log('Payment Data keys:', Object.keys(paymentData));

      res.status(201).json({
        transactionId: transaction._id,
        paymentId: paymentData.payment_id,
        invoiceUrl: paymentData.invoice_url,
        qrCode: qrCodeUrl,
        payAddress: paymentData.pay_address,
        amount: transaction.amount,
        cryptoAmount: paymentData.pay_amount,
        cryptoCurrency: paymentData.pay_currency,
        status: transaction.status,
        paymentStatus: paymentData.payment_status,
        expirationEstimate: paymentData.expiration_estimate,
        message: 'Deposit request created successfully. Please complete the payment via NOWPayments.'
      });
    } catch (nowpaymentsError) {
      // If NOWPayments fails, mark transaction as failed
      transaction.status = 'failed';
      transaction.description = `${orderDescription} - NOWPayments error: ${nowpaymentsError.message}`;
      await transaction.save();

      console.error('NOWPayments API error:', nowpaymentsError);
      console.error('Error stack:', nowpaymentsError.stack);
      console.error('API Key configured:', !!process.env.NOWPAYMENTS_API_KEY);
      console.error('Callback URL configured:', !!process.env.NOWPAYMENTS_CALLBACK_URL);
      console.error('Sandbox mode:', process.env.NOWPAYMENTS_SANDBOX);
      
      return res.status(500).json({
        message: 'Failed to create payment. Please try again.',
        error: process.env.NODE_ENV === 'development' ? nowpaymentsError.message : undefined
      });
    }
  } catch (error) {
    console.error('Create deposit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Webhook handler function (exported separately for registration before JSON parser)
const webhookHandler = async (req, res) => {
  try {
    const signature = req.headers['x-nowpayments-sig'];
    let rawBody;
    
    // Handle raw body (Buffer)
    if (Buffer.isBuffer(req.body)) {
      rawBody = req.body.toString('utf8');
    } else if (typeof req.body === 'string') {
      rawBody = req.body;
    } else {
      rawBody = JSON.stringify(req.body);
    }

    // Verify webhook signature
    if (!nowpaymentsService.verifyWebhookSignature(rawBody, signature)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const webhookData = JSON.parse(rawBody);
    const { payment_id, payment_status, order_id, pay_amount, price_amount } = webhookData;

    if (!payment_id || !order_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find transaction by ID (order_id is our transaction._id)
    const transaction = await Transaction.findById(order_id).populate('user');

    if (!transaction) {
      console.error(`Transaction not found: ${order_id}`);
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Prevent duplicate processing
    if (transaction.status === 'completed' && nowpaymentsService.isPaymentCompleted(payment_status)) {
      return res.status(200).json({ message: 'Transaction already processed' });
    }

    // Update transaction with latest NOWPayments data
    transaction.nowpaymentsPaymentId = payment_id;
    if (webhookData.pay_currency) transaction.cryptoCurrency = webhookData.pay_currency;
    if (webhookData.pay_amount) transaction.cryptoAmount = webhookData.pay_amount;

    // Map NOWPayments status to our status
    const mappedStatus = nowpaymentsService.mapPaymentStatus(payment_status);
    transaction.status = mappedStatus;

    // Verify amount matches (with small tolerance for currency conversion)
    const amountDiff = Math.abs(transaction.amount - parseFloat(price_amount || transaction.amount));
    if (amountDiff > 0.01) {
      console.warn(`Amount mismatch for transaction ${order_id}: expected ${transaction.amount}, got ${price_amount}`);
    }

    await transaction.save();

    // Update user balance if payment is completed
    if (nowpaymentsService.isPaymentCompleted(payment_status)) {
      try {
        const userId = transaction.user._id || transaction.user;
        const newBalance = await updateUserBalance(userId, transaction.amount);
        console.log(`Payment completed for transaction ${order_id}. User balance updated to ${newBalance}`);
      } catch (balanceError) {
        console.error('Error updating balance:', balanceError);
        // Don't fail the webhook, log the error
      }
    }

    // Always return 200 to NOWPayments
    res.status(200).json({ 
      message: 'Webhook processed successfully',
      transactionId: transaction._id,
      status: transaction.status
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Still return 200 to prevent NOWPayments from retrying too aggressively
    res.status(200).json({ message: 'Webhook received but processing failed' });
  }
};

// Register webhook route (will be registered separately in index.js with raw body parser)
// router.post('/webhook', webhookHandler);

// GET /api/deposit/status/:transactionId - Get payment status (for polling)
router.get('/status/:transactionId', authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.userId;

    const transaction = await Transaction.findOne({
      _id: transactionId,
      user: userId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // If transaction has NOWPayments payment ID, fetch latest status
    if (transaction.nowpaymentsPaymentId) {
      try {
        const paymentStatus = await nowpaymentsService.getPaymentStatus(transaction.nowpaymentsPaymentId);
        
        // Update transaction if status changed
        const mappedStatus = nowpaymentsService.mapPaymentStatus(paymentStatus.payment_status);
        if (transaction.status !== mappedStatus) {
          transaction.status = mappedStatus;
          
          // Update balance if payment completed
          if (nowpaymentsService.isPaymentCompleted(paymentStatus.payment_status) && transaction.status !== 'completed') {
            await updateUserBalance(userId, transaction.amount);
          }
          
          await transaction.save();
        }

        return res.json({
          transactionId: transaction._id,
          status: transaction.status,
          paymentStatus: paymentStatus.payment_status,
          amount: transaction.amount,
          cryptoAmount: transaction.cryptoAmount,
          cryptoCurrency: transaction.cryptoCurrency,
          invoiceUrl: transaction.nowpaymentsInvoiceUrl,
          qrCode: transaction.nowpaymentsQrCode
        });
      } catch (statusError) {
        console.error('Error fetching payment status:', statusError);
        // Return transaction status even if API call fails
      }
    }

    res.json({
      transactionId: transaction._id,
      status: transaction.status,
      amount: transaction.amount,
      cryptoAmount: transaction.cryptoAmount,
      cryptoCurrency: transaction.cryptoCurrency,
      invoiceUrl: transaction.nowpaymentsInvoiceUrl,
      qrCode: transaction.nowpaymentsQrCode
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/deposit/transactions - Get user's deposit history
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const transactions = await Transaction.find({ user: userId, type: 'deposit' })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      transactions: transactions.map(t => ({
        id: t._id,
        amount: t.amount,
        status: t.status,
        cryptoAmount: t.cryptoAmount,
        cryptoCurrency: t.cryptoCurrency,
        invoiceUrl: t.nowpaymentsInvoiceUrl,
        qrCode: t.nowpaymentsQrCode || (t.qrCode ? `/api/qr/${t.qrCode}` : null),
        paymentProof: t.paymentProof,
        description: t.description,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
module.exports.webhookHandler = webhookHandler;

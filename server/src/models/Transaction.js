const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
      type: String, 
      enum: ['deposit', 'withdrawal', 'investment', 'commission'], 
      required: true 
    },
    amount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'cancelled'], 
      default: 'pending' 
    },
    paymentProof: { type: String },
    qrCode: { type: String },
    description: { type: String },
    planName: { type: String }, // Track which investment plan was purchased
    planDailyReturn: { type: Number }, // e.g. 2.5 for 2.5%
    planDurationDays: { type: Number }, // e.g. 7, 14, 30
    // NOWPayments fields
    nowpaymentsPaymentId: { type: String },
    nowpaymentsInvoiceUrl: { type: String },
    nowpaymentsQrCode: { type: String },
    cryptoCurrency: { type: String },
    cryptoAmount: { type: Number },
    // Withdrawal fields
    payMethod: { type: String }, // 'crypto' | 'bank'
    cryptoAddress: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);



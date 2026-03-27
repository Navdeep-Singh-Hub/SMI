const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    auth0Id: { type: String, unique: true, sparse: true }, // Auth0 sub; null for legacy users
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: false }, // optional for Auth0 users
    balance: { type: Number, default: 0 },
    wallet: { type: Number, default: 0 },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Profile (required for full account; collected at registration / profile)
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    // KYC — required only for withdrawals; submitted docs pending admin review
    kycStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none'
    },
    kycAadhaarFront: { type: String, default: '' },
    kycAadhaarBack: { type: String, default: '' },
    kycPan: { type: String, default: '' },
    kycHoldingPhoto: { type: String, default: '' },
    kycSubmittedAt: { type: Date },
    kycRejectedReason: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

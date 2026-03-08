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
    referralCode: { type: String, unique: true, sparse: true }, // e.g. ABC12XYZ, for shareable link
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);



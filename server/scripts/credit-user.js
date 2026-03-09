/**
 * One-time script to credit a user's balance for testing (e.g. buy plans without NOWPayments).
 * Run from server folder:
 *   node scripts/credit-user.js --list
 *   node scripts/credit-user.js <email> [amount]
 *   node scripts/credit-user.js <index> [amount]   (index from --list: 1, 2, 3...)
 * Example: node scripts/credit-user.js 2 500
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SMI';
const arg1 = (process.argv[2] || '').trim().replace(/\\+$/, '');
const listMode = arg1 === '--list' || arg1 === '-l';
const amount = listMode ? 0 : (parseFloat(process.argv[3]) || 500);

// index mode: arg1 is a number (1-based position from --list)
const indexNum = parseInt(arg1, 10);
const indexMode = !listMode && !isNaN(indexNum) && indexNum >= 1;
const email = !listMode && !indexMode ? (process.argv[2] || '').trim().replace(/\\+$/, '') : null;

if (!listMode && !email && !indexMode) {
  console.error('Usage: node scripts/credit-user.js --list');
  console.error('       node scripts/credit-user.js <email> [amount]');
  console.error('       node scripts/credit-user.js <index> [amount]  (index 1, 2, 3... from --list)');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    if (listMode) {
      const users = await User.find({}).select('email name balance wallet createdAt').sort({ createdAt: 1 }).lean();
      console.log('Users in DB (' + users.length + '):');
      users.forEach((u, i) => {
        console.log((i + 1) + '.', u.email, '| balance: $' + (u.balance || 0).toFixed(2), '| name:', u.name);
      });
      console.log('\nTo credit by index: node scripts/credit-user.js <number> [amount]  e.g. node scripts/credit-user.js 1 500');
      return;
    }

    let user;
    if (indexMode) {
      const users = await User.find({}).sort({ createdAt: 1 }).limit(indexNum);
      user = users[indexNum - 1];
      if (!user) {
        console.error('No user at index', indexNum, '(run --list to see indices)');
        process.exit(1);
      }
    } else {
      user = await User.findOne({ email: email.trim().toLowerCase() });
    }

    if (!user) {
      console.error('User not found with email:', email);
      console.error('Run with --list to see users. Use index: node scripts/credit-user.js 1 500');
      process.exit(1);
    }
    user.balance = (user.balance || 0) + amount;
    await user.save();
    console.log('Updated balance for', user.email, '| New balance: $' + user.balance.toFixed(2), '| Added: $' + amount.toFixed(2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

run();

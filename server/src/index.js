const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(morgan('dev'));

// Static file serving for QR codes and uploads
app.use('/api/qr', express.static(path.join(__dirname, '..', 'qrs')));
app.use('/api/uploads/payment-proofs', express.static(path.join(__dirname, '..', 'uploads', 'payment-proofs')));
app.use('/api/uploads/kyc', express.static(path.join(__dirname, '..', 'uploads', 'kyc')));

// Webhook route needs raw body for signature verification (register before JSON parser)
const depositRoutes = require('./routes/deposit.routes');
app.post('/api/deposit/webhook', express.raw({ type: 'application/json' }), depositRoutes.webhookHandler);

// JSON parser for all other routes
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/deposit', require('./routes/deposit.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/user/kyc', require('./routes/kyc.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/invest', require('./routes/invest.routes'));
app.use('/api/withdraw', require('./routes/withdraw.routes'));
app.use('/api/affiliate', require('./routes/affiliate.routes'));
app.use('/api/downline', require('./routes/downline.routes'));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SMI';

// Handle uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Mongo connected');
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/api/health\n`);
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.error('Please stop the other process or change the PORT in .env');
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
    
    // Handle process termination
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        mongoose.connection.close();
        process.exit(0);
      });
    });
    
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
}

start();



# Setting Up SMI Project on a New Laptop

## Why You're Getting This Error

The error `ERR_CONNECTION_REFUSED` on port 5000 means:
- ✅ Your **frontend** is running (on port 3000)
- ❌ Your **backend server** is NOT running (should be on port 5000)

The frontend is trying to connect to `http://localhost:5000/api/auth/register`, but there's no server listening on that port.

---

## Step-by-Step Setup Guide

### 1. Prerequisites Check

Make sure you have installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or Atlas account) - See `server/MONGODB_SETUP.md`

Verify installation:
```powershell
node --version
npm --version
```

---

### 2. Install Dependencies

#### Install Backend Dependencies:
```powershell
cd server
npm install
```

#### Install Frontend Dependencies:
```powershell
cd client
npm install
```

---

### 3. Set Up Environment Variables

Create a `.env` file in the `server` folder:

```powershell
cd server
# Create .env file (if it doesn't exist)
```

**Required `.env` file contents:**

```env
# Server Configuration
PORT=5000

# MongoDB Connection
# Option 1: Local MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/SMI

# Option 2: MongoDB Atlas (Cloud)
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/SMI?retryWrites=true&w=majority

# JWT Secret (for authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# NOWPayments Configuration (if using payments)
NOWPAYMENTS_API_KEY=your-api-key-here
NOWPAYMENTS_IPN_SECRET=your-ipn-secret-here
NOWPAYMENTS_BASE_CURRENCY=USD
NOWPAYMENTS_PAY_CURRENCY=usdttrc20
NOWPAYMENTS_CALLBACK_URL=http://localhost:5000/api/deposit/webhook
NOWPAYMENTS_SANDBOX=true
FRONTEND_URL=http://localhost:3000
```

**Important Notes:**
- Replace `your-super-secret-jwt-key-change-this-in-production` with a random secure string
- If using MongoDB Atlas, replace the connection string with your actual credentials
- If NOT using NOWPayments, you can comment out or remove those lines

---

### 4. Set Up MongoDB

#### Option A: Local MongoDB (Recommended for Development)

1. **Install MongoDB** (if not already installed):
   - Download from: https://www.mongodb.com/try/download/community
   - Install as Windows Service

2. **Start MongoDB Service**:
   ```powershell
   # Check if MongoDB service is running
   Get-Service MongoDB
   
   # If not running, start it
   Start-Service MongoDB
   ```

   Or use the helper script:
   ```powershell
   cd server
   .\start-mongodb.ps1
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string and add to `.env` as `MONGO_URI`
4. See `server/MONGODB_SETUP.md` for detailed instructions

---

### 5. Start the Backend Server

```powershell
cd server
npm start
```

**You should see:**
```
Mongo connected
✅ Server running on http://localhost:5000
✅ Health check: http://localhost:5000/api/health
```

**If you see errors:**
- **"Port 5000 is already in use"**: Another process is using port 5000. Stop it or change `PORT` in `.env`
- **"Mongo connection failed"**: MongoDB is not running. Start MongoDB service (see step 4)
- **"Cannot find module"**: Run `npm install` in the `server` folder

---

### 6. Start the Frontend (in a NEW terminal)

```powershell
cd client
npm start
```

**You should see:**
```
Compiled successfully!
You can now view client in the browser.
  Local:            http://localhost:3000
```

---

### 7. Test the Setup

1. Open browser: http://localhost:3000
2. Try to register a new account
3. Check the browser console (F12) - there should be NO connection errors

---

## Common Issues & Solutions

### Issue 1: "ERR_CONNECTION_REFUSED"
**Cause**: Backend server is not running  
**Solution**: Start the backend server (step 5)

### Issue 2: "Mongo connection failed"
**Cause**: MongoDB is not running  
**Solution**: 
- For local MongoDB: `Start-Service MongoDB`
- For Atlas: Check your connection string and IP whitelist

### Issue 3: "Port 5000 is already in use"
**Cause**: Another application is using port 5000  
**Solution**: 
- Find and stop the other process, OR
- Change `PORT=5001` in `.env` and update frontend API calls

### Issue 4: "Cannot find module 'xyz'"
**Cause**: Dependencies not installed  
**Solution**: Run `npm install` in both `server` and `client` folders

### Issue 5: "JWT_SECRET is not defined"
**Cause**: Missing `.env` file or JWT_SECRET variable  
**Solution**: Create `.env` file with `JWT_SECRET=your-secret-key`

---

## Quick Start Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB installed and running (local or Atlas)
- [ ] Backend dependencies installed (`cd server && npm install`)
- [ ] Frontend dependencies installed (`cd client && npm install`)
- [ ] `.env` file created in `server` folder with all required variables
- [ ] Backend server started (`cd server && npm start`)
- [ ] Frontend started (`cd client && npm start`)
- [ ] Both servers running without errors
- [ ] Can access http://localhost:3000
- [ ] Can register/login without connection errors

---

## Need Help?

1. Check the terminal where you started the backend server for error messages
2. Check the browser console (F12) for frontend errors
3. Verify MongoDB is running: `Get-Service MongoDB`
4. Test backend health: Open http://localhost:5000/api/health in browser (should show `{"ok":true}`)






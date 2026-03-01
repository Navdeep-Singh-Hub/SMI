# How to Install MongoDB Server

## Important: MongoDB Compass vs MongoDB Server

- **MongoDB Compass** = GUI tool (you already have this) ✅
- **MongoDB Server** = The actual database (you need to install this) ❌

## Quick Installation Steps

### Step 1: Download MongoDB Community Server
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - **Version**: Latest (7.0 or 6.0)
   - **Platform**: Windows
   - **Package**: MSI
3. Click **Download**

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose **Complete** installation
3. **IMPORTANT**: Check ✅ **"Install MongoDB as a Service"**
4. Choose **"Run service as Network Service user"**
5. **IMPORTANT**: Check ✅ **"Install MongoDB Compass"** (you can skip this since you have it)
6. Click **Install**

### Step 3: Verify Installation
After installation, open PowerShell as Administrator and run:
```powershell
Start-Service MongoDB
Get-Service MongoDB
```

You should see the service status as "Running".

### Step 4: Test Connection
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. It should connect successfully! ✅

## Alternative: Use MongoDB Atlas (No Installation Needed)

If you don't want to install MongoDB locally, you can use MongoDB Atlas (cloud):

1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster
3. Get connection string
4. Use that connection string in your `.env` file instead



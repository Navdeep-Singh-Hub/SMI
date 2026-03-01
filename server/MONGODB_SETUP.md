# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

1. **Sign up for free**: Go to https://www.mongodb.com/cloud/atlas/register
2. **Create a cluster**: Choose the free tier (M0)
3. **Create a database user**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
4. **Whitelist your IP**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your IP
5. **Get connection string**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/SMI?retryWrites=true&w=majority`
6. **Update .env file**:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/SMI?retryWrites=true&w=majority
   ```

## Option 2: Local MongoDB Installation

### Windows Installation:

1. **Download MongoDB Community Server**:
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows, MSI package
   - Download and run the installer

2. **Install MongoDB**:
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (optional GUI tool)

3. **Start MongoDB Service**:
   ```powershell
   # Check if service is running
   Get-Service MongoDB
   
   # Start the service if not running
   Start-Service MongoDB
   ```

4. **Verify installation**:
   ```powershell
   mongod --version
   ```

5. **Default connection** (already configured):
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/SMI
   ```

## Option 3: Docker (Alternative)

If you have Docker installed:

```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Quick Start

1. Copy `.env.example` to `.env`:
   ```powershell
   cd server
   Copy-Item .env.example .env
   ```

2. Edit `.env` and add your MongoDB connection string

3. Start the server:
   ```powershell
   npm start
   ```

## Troubleshooting

- **Connection refused**: MongoDB is not running or not accessible
- **Authentication failed**: Check your username/password in the connection string
- **Network timeout**: Check your IP whitelist in MongoDB Atlas



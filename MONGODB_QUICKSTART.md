# 🚀 Vault Finance - MongoDB Quick Start Guide

## Overview

Vault Finance backend requires MongoDB for data persistence. You have two options:

### Option 1: MongoDB Local (Development)
- Install MongoDB Community Edition locally
- Best for local development
- Data stored on your machine
- See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for detailed setup

### Option 2: MongoDB Atlas (Cloud - Recommended for Testing)
- Use cloud-hosted MongoDB
- Free tier available
- No local installation needed
- Perfect for testing before production

## Quick Start with MongoDB Atlas (5 minutes)

### Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Sign Up Free"
3. Create account with email and password
4. Confirm email address

### Step 2: Create a Free Cluster

1. Click "Create" cluster button
2. Select "Shared" (free tier)
3. Select region (closest to you)
4. Click "Create Cluster"
5. Wait 2-3 minutes for cluster to be created

### Step 3: Create Database User

1. In left menu, click "Database Access"
2. Click "Add New Database User"
3. Set username: `vaultfinance` (or any username)
4. Set password: Create a strong password
5. Click "Add User"

**Important**: Save your username and password!

### Step 4: Get Connection String

1. In left menu, click "Clusters"
2. Click "Connect" button on your cluster
3. Select "Drivers" (not "MongoDB Shell")
4. Copy the connection string that looks like:
```
mongodb+srv://username:password@cluster.mongodb.net/vault-finance?retryWrites=true&w=majority
```

### Step 5: Configure Backend

1. Update `backend/.env` file:
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/vault-finance?retryWrites=true&w=majority
```

2. Replace:
   - `username` with your database user
   - `password` with your password
   - `cluster-name` with your actual cluster name (from connection string)

### Step 6: Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3001
```

## Quick Start with Local MongoDB

### Windows

1. Download installer: https://www.mongodb.com/try/download/community
2. Run installer, follow setup wizard
3. Verify: Open PowerShell and run `mongod`
4. Should see: `[initandlisten] waiting for connections on port 27017`

### macOS

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux

```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

## Testing Your Setup

After starting backend, test with:

```bash
# Terminal 1: Backend already running

# Terminal 2: Test health check
curl http://localhost:3001/health
# Should return: {"status":"ok"}

# Terminal 3: Frontend
npm run dev
```

Then:
1. Open http://localhost:5173/Vault-Finance/
2. Sign up with test account
3. Backend console should show success messages
4. Dashboard should display data

## Verify Data in MongoDB

### MongoDB Atlas
1. Go to https://account.mongodb.com/account/login
2. Click "Clusters"
3. Click "Collections" tab
4. Browse `vault-finance` database
5. Click `users` or `transactions` collections
6. See your data

### Local MongoDB
```bash
mongosh
use vault-finance
db.users.find()          # View all users
db.transactions.find()   # View all transactions
```

## Environment Variables Reference

### Development (Local MongoDB)
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vault-finance
```

### Development (MongoDB Atlas)
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/vault-finance?retryWrites=true&w=majority
```

### Production (MongoDB Atlas)
Same as development - use Render dashboard to set environment variable

## Troubleshooting

### "Cannot connect to MongoDB"
- **Local**: Verify `mongod` is running
- **Atlas**: Check username/password in connection string
- **Atlas**: Verify IP address is whitelisted (allow 0.0.0.0/0 for development)

### "MONGODB_URI not found"
- Ensure `.env` file exists in `backend/` directory
- Check .env has correct MONGODB_URI

### Backend stuck on startup
- Press Ctrl+C
- Verify MongoDB connection string is correct
- Try connecting with `mongosh` or MongoDB Compass first

### Connection string errors
- Copy-paste from MongoDB Atlas interface (don't manually edit)
- Ensure password doesn't have special characters (or URL encode them)
- Replace `<password>` placeholder with actual password

## Next Steps

- ✅ MongoDB configured
- Start frontend: `npm run dev`
- Start backend: `cd backend && npm run dev`
- Test application
- Create sample data
- Deploy to Render (see RENDER_DEPLOYMENT.md)

## Production Deployment

See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for deploying to Render with MongoDB Atlas.

## Database Schema Reference

### Users Collection
```javascript
{
  _id: ObjectId,
  email: "user@example.com",
  fullName: "John Doe",
  password: "hashed_password", // Should be bcrypt hashed
  theme: "light" | "dark",
  role: "admin" | "user",
  createdAt: Date,
  updatedAt: Date
}
```

### Transactions Collection
```javascript
{
  _id: ObjectId,
  date: "2024-01-15",
  amount: 50000,
  category: "Salary" | "Food" | "Travel" | etc,
  type: "income" | "expense",
  merchant: "Employer",
  note: "Monthly salary",
  createdAt: Date,
  updatedAt: Date
}
```

## Documentation

- [LOCAL_SETUP.md](./LOCAL_SETUP.md) - Detailed local MongoDB setup
- [MONGODB_SETUP.md](./MONGODB_SETUP.md) - Complete MongoDB guide
- [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) - Production deployment
- [backend/README.md](./backend/README.md) - API documentation

## Support

- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Mongoose: https://mongoosejs.com/
- Render Docs: https://render.com/docs

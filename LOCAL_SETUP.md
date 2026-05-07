# Vault Finance - Local Development Setup with MongoDB

## Complete Development Environment Setup

This guide will help you set up the entire Vault Finance application locally with MongoDB.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- MongoDB Community Edition installed
- (Optional) MongoDB Compass for GUI management
- (Optional) VS Code for development

## Step 1: Install MongoDB Community Edition

### Windows

1. Download the installer from: https://www.mongodb.com/try/download/community
2. Run the installer (.msi file)
3. Follow the installation wizard, keep default options
4. MongoDB will be installed as a Windows Service and auto-start

**To start MongoDB manually:**
```powershell
mongod
```

**To verify MongoDB is running:**
```powershell
mongosh  # This opens the MongoDB shell
```

### macOS

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl status mongodb
```

## Step 2: Verify MongoDB is Running

```bash
# Open a new terminal and run:
mongosh

# You should see:
# Current Mongo host and port: 127.0.0.1:27017
# Current Database: test
# >
```

If you see the MongoDB shell prompt, MongoDB is running! Type `exit` to quit.

## Step 3: Clone and Setup Frontend

```bash
cd c:\Users\dhore\OneDrive\Desktop\Internship\Vault\ Finance\Vault-Finance

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:3001" > .env

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173/Vault-Finance/`

## Step 4: Setup and Start Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
npm install

# Create .env file
echo "PORT=3001" > .env
echo "NODE_ENV=development" >> .env
echo "MONGODB_URI=mongodb://localhost:27017/vault-finance" >> .env

# Start development server
npm run dev
```

Backend will start on: `http://localhost:3001`

## Step 5: Test the Application

1. **Open Frontend**: http://localhost:5173/Vault-Finance/
2. **Sign Up**: Create a test account
   - Email: `test@example.com`
   - Password: `password123`
   - Full Name: `Test User`
3. **Check Backend Console**: Should see:
   ```
   ✅ Connected to MongoDB
   🚀 Server running on http://localhost:3001
   ```
4. **Verify Data Saved**: 
   - Open a new terminal and run `mongosh`
   - Type: `use vault-finance`
   - Type: `db.users.findOne()` - should show your user
   - Type: `exit`

## Step 6: Verify Full Integration

### Test Signup Flow
1. Frontend: Sign up with new account
2. Backend console: Should show API request logged
3. MongoDB shell: Verify user created
   ```
   mongosh
   use vault-finance
   db.users.find()
   ```

### Test Dashboard
1. After signup, you should be redirected to dashboard
2. Should show opening balance: ₹12,840
3. Backend is serving this data from MongoDB

## Stopping Services

### Stop Backend
- Press `Ctrl+C` in the terminal running npm run dev

### Stop MongoDB
```powershell
# Windows: MongoDB will stop when service stops
# macOS: brew services stop mongodb-community
# Linux: sudo systemctl stop mongodb
```

## Database Management

### View All Data (MongoDB Shell)
```bash
mongosh
use vault-finance
db.users.find()          # View all users
db.transactions.find()   # View all transactions
```

### Reset Database (Remove All Data)
```bash
mongosh
use vault-finance
db.users.deleteMany({})
db.transactions.deleteMany({})
```

### Export Database
```bash
mongodump --db vault-finance --out ./mongodb-backup
```

### Import Database
```bash
mongorestore --db vault-finance ./mongodb-backup/vault-finance
```

## MongoDB Compass (GUI Management)

1. Download from: https://www.mongodb.com/try/download/compass
2. Install and launch
3. Click "Connect" (should auto-detect local MongoDB)
4. Navigate to `vault-finance` database
5. View collections: `users`, `transactions`
6. Browse data visually

## Development Workflow

### Terminal 1 - MongoDB
```bash
# Just verify it's running, then leave it
mongosh
# Type 'exit' to close but MongoDB service keeps running
```

### Terminal 2 - Backend
```bash
cd backend
npm run dev
# Keep this running for development
```

### Terminal 3 - Frontend
```bash
npm run dev
# Keep this running for development
```

### Terminal 4 - Data Inspection (Optional)
```bash
mongosh
use vault-finance
db.users.find()  # Check data anytime
```

## Troubleshooting

### "MongoDB connection refused"
- **Solution**: Ensure MongoDB is running (`mongosh` should connect)
- **Windows**: Check Services - MongoDB should be running
- **macOS**: Run `brew services list | grep mongodb`
- **Linux**: Run `sudo systemctl status mongodb`

### Backend stuck at "Connecting to MongoDB..."
- **Solution**: Press Ctrl+C to stop, verify MongoDB is running, restart backend

### "EADDRINUSE: address already in use :::3001"
- **Solution**: Backend port already in use
```bash
# Kill existing process
# Windows: taskkill /F /PID <process-id>
# macOS/Linux: kill -9 <process-id>
# Or change PORT in .env file
```

### Frontend shows blank page
- **Solution**: Check browser console (F12) for errors
- Verify `VITE_API_URL=http://localhost:3001` in .env
- Verify backend is running

### Data not persisting after restart
- **Solution**: Verify `MONGODB_URI` in backend .env points to local MongoDB
- Check MongoDB is running: `mongosh`

## File Structure for Reference

```
Vault-Finance/
├── .env (VITE_API_URL=http://localhost:3001)
├── package.json
├── src/
│   ├── services/
│   │   └── index.ts (calls backend API)
│   ├── App.tsx
│   └── main.tsx
├── backend/
│   ├── .env (PORT, NODE_ENV, MONGODB_URI)
│   ├── package.json
│   ├── src/
│   │   ├── mongodb.ts (connects to MongoDB)
│   │   ├── models.ts (Mongoose schemas)
│   │   ├── db.ts (database layer)
│   │   ├── server.ts (Express setup)
│   │   ├── types.ts (TypeScript interfaces)
│   │   └── routes/ (API endpoints)
│   ├── dist/ (compiled JavaScript)
│   └── tsconfig.json
└── docs/
    ├── MONGODB_SETUP.md
    ├── QUICKSTART.md
    └── RENDER_DEPLOYMENT.md
```

## Production Deployment

When ready to deploy to Render:
1. See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
2. Set up MongoDB Atlas (cloud)
3. Deploy backend and frontend to Render
4. Set environment variables in Render dashboard

## Next Steps

- ✅ Local development environment ready
- Create sample transactions in the app
- Test all CRUD operations
- Test dashboard analytics
- Test reports page
- Then: Deploy to production

## Support

- Backend API Docs: See `backend/README.md`
- MongoDB Docs: https://docs.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/
- Render Docs: https://render.com/docs

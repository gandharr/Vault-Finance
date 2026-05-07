# MongoDB Setup Guide for Vault Finance

## Local Development with MongoDB

### Option 1: MongoDB Community (Local)

#### On Windows:
1. Download MongoDB Community from: https://www.mongodb.com/try/download/community
2. Run the installer
3. MongoDB will be installed as a Windows Service
4. Start MongoDB:
```bash
# MongoDB service should start automatically
# Or manually start via Services or:
mongod
```

5. MongoDB will run on: `mongodb://localhost:27017`

#### On macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Or run manually:
mongod
```

#### On Linux:
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb

# Or using Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Option 2: MongoDB Atlas (Cloud - Recommended for Production)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Create a `.env` file in backend folder:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

## Local Development Setup

### Step 1: Start MongoDB
```bash
# If using local MongoDB
mongod

# Or with Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 2: Create backend .env file
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vault-finance
```

### Step 3: Start Backend Server
```bash
npm run dev
# Backend should connect to MongoDB automatically
```

Expected output:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3001
```

## Testing MongoDB Connection

### Option 1: Use MongoDB Compass (GUI)
1. Download from: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. You should see `vault-finance` database and collections

### Option 2: Use MongoDB CLI
```bash
# Connect to MongoDB
mongosh

# Switch to database
use vault-finance

# View collections
show collections

# View users
db.users.find()

# View transactions
db.transactions.find()
```

### Option 3: Test via API
```bash
# Signup a user
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "fullName":"Test User",
    "password":"password123"
  }'

# Get dashboard stats (will be empty initially)
curl http://localhost:3001/api/dashboard/stats
```

## Production Deployment to Render + MongoDB Atlas

### Step 1: Set up MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist Render IP (allow all: 0.0.0.0/0)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/vault-finance?retryWrites=true&w=majority`

### Step 2: Deploy Backend on Render
1. Push code to GitHub
2. Go to Render Dashboard
3. New Web Service
4. Select your GitHub repo
5. Configure:
   - **Name**: `vault-finance-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://username:password@cluster.mongodb.net/vault-finance?retryWrites=true&w=majority`
7. Click "Create Web Service"

### Step 3: Deploy Frontend on Render
1. New Static Site
2. Select same GitHub repo
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com` (from Step 2)
5. Click "Create Static Site"

## MongoDB Atlas Connection String Format

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority
```

Replace:
- `username`: Your MongoDB Atlas username
- `password`: Your MongoDB Atlas password
- `cluster0.xxxxx`: Your cluster name
- `database-name`: `vault-finance`

## Data Models

### User Collection
```javascript
{
  email: String (unique),
  fullName: String,
  password: String,
  theme: 'light' | 'dark',
  role: 'admin' | 'user',
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Collection
```javascript
{
  date: String (YYYY-MM-DD),
  amount: Number,
  category: String,
  type: 'income' | 'expense',
  merchant: String,
  note: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Backup & Export

### Export data from MongoDB Atlas
```bash
# Install mongodump
# Then run:
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/vault-finance"
```

### Import data
```bash
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/vault-finance" ./dump
```

## Troubleshooting

### Connection refused error
- Ensure MongoDB is running
- Check `MONGODB_URI` is correct
- For Atlas: Verify IP whitelist includes your IP

### Authentication failed
- Check username/password in connection string
- Ensure user has correct permissions
- Try creating a new database user

### Collections not appearing
- Check database name in connection string
- Create a document in the collection first
- MongoDB creates collections on first insert

## Performance Tips

1. **Indexing**: MongoDB automatically indexes `_id`. For queries on `email`, ensure index exists:
```javascript
db.users.createIndex({ email: 1 })
```

2. **Connection Pooling**: Already handled by Mongoose

3. **Query Optimization**: Use `.lean()` in queries for read-only operations

## References

- MongoDB Docs: https://docs.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Render Docs: https://render.com/docs

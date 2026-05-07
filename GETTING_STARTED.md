# 🚀 Vault Finance - Getting Started

## 📚 Choose Your Documentation

### I Want To...

#### Get Running in 5 Minutes
👉 Read: **[MONGODB_QUICKSTART.md](./MONGODB_QUICKSTART.md)**
- MongoDB Atlas setup (easiest, no installation)
- Environment configuration
- Quick verification steps

#### Set Up Local Development (15 minutes)
👉 Read: **[LOCAL_SETUP.md](./LOCAL_SETUP.md)**
- Install MongoDB locally
- Development environment setup
- Verification steps

#### Understand Full MongoDB Setup
👉 Read: **[MONGODB_SETUP.md](./MONGODB_SETUP.md)**
- MongoDB concepts and architecture
- Local installation details
- MongoDB Atlas cloud setup
- Backup and export procedures
- Troubleshooting guide

#### Deploy to Production
👉 Read: **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)**
- Push to GitHub
- Deploy backend to Render
- Deploy frontend to Render
- MongoDB Atlas connection
- Production verification

#### Understand API Endpoints
👉 Read: **[backend/README.md](./backend/README.md)**
- All API endpoints
- Request/response examples
- Error codes

#### Track Project Progress
👉 Read: **[PROGRESS.md](./PROGRESS.md)**
- Completed tasks
- In-progress items
- Testing checklist
- Security roadmap
- Timeline and milestones

---

## ⚡ Quick Start (Choose One Option)

### Option 1: MongoDB Atlas (Cloud - Easiest) ⭐

```bash
# 1. Create free account
# https://www.mongodb.com/cloud/atlas

# 2. Create cluster and database user
# (Takes 2-3 minutes)

# 3. Get connection string
# Copy from Atlas dashboard

# 4. Configure backend
cd backend
# Update .env with your MongoDB URI
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vault-finance

# 5. Start backend
npm install
npm run dev

# 6. In new terminal: Start frontend
npm run dev

# 7. Open browser
# http://localhost:5173/Vault-Finance/
```

**Time**: ~5 minutes
**Difficulty**: Easy
**No installation needed**: ✅

### Option 2: Local MongoDB

```bash
# 1. Install MongoDB
# https://www.mongodb.com/try/download/community
# (Windows: Run installer)
# (Mac: brew install mongodb-community)

# 2. Start MongoDB
mongod

# 3. Backend already configured for local
cd backend
npm install
npm run dev

# 4. In new terminal: Frontend
npm run dev

# 5. Open browser
# http://localhost:5173/Vault-Finance/
```

**Time**: ~15 minutes (includes installation)
**Difficulty**: Medium
**Installation required**: ✅

### Option 3: Use Startup Script (Windows)

```bash
# Just run:
start-dev.bat

# This opens 2 windows:
# - Backend on http://localhost:3001
# - Frontend on http://localhost:5173/Vault-Finance/
```

**Time**: ~1 minute
**Difficulty**: Easiest
**Works only on Windows**: ✅

---

## 🧪 Test Your Setup

### Step 1: Verify Backend is Running
```bash
# Test health check
curl http://localhost:3001/health
# Should see: {"status":"ok"}
```

### Step 2: Sign Up in Frontend
1. Open http://localhost:5173/Vault-Finance/
2. Click "Sign Up"
3. Fill in test details:
   - Email: `test@example.com`
   - Name: `Test User`
   - Password: `password123`
4. Click "Sign Up"

### Step 3: Verify Backend Received Request
- Check backend terminal for logs
- Should show successful signup messages

### Step 4: Check Database
- **MongoDB Atlas**: Open Collections tab to see data
- **Local MongoDB**: Run `mongosh` and `db.users.find()`

### Step 5: Test Dashboard
- After signup, should redirect to dashboard
- Should show opening balance: ₹12,840
- Backend successfully retrieved data from MongoDB!

---

## 📋 Environment Configuration

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

### Backend (.env)

#### Local MongoDB
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vault-finance
```

#### MongoDB Atlas
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/vault-finance?retryWrites=true&w=majority
```

**Important**: Save username and password securely!

---

## 🆘 Common Issues

### "Cannot connect to MongoDB"
**Solution**: 
- Check MongoDB is running
- Verify connection string in .env
- For Atlas: Check IP whitelist (set to 0.0.0.0/0)

### "Port 3001 already in use"
**Solution**: 
- Change PORT in backend/.env
- Or find and stop process using 3001
- Or close other backend instances

### "Frontend can't connect to backend"
**Solution**:
- Verify backend is running
- Check VITE_API_URL in frontend .env
- Check browser console (F12) for CORS errors

### "MONGODB_URI not found"
**Solution**:
- Ensure .env file exists in backend/ directory
- Check file isn't named .env.example
- Restart backend after updating .env

---

## 📂 Project Structure

```
Vault-Finance/
├── src/                    # Frontend React app
│   ├── services/
│   │   └── index.ts       # API calls to backend
│   ├── App.tsx
│   └── main.tsx
├── backend/               # Express API server
│   ├── src/
│   │   ├── mongodb.ts    # ← MongoDB connection
│   │   ├── models.ts     # ← Mongoose schemas
│   │   ├── db.ts         # ← Database operations
│   │   ├── server.ts     # ← Express setup
│   │   └── routes/       # ← API endpoints
│   ├── .env              # ← Your MongoDB config
│   └── package.json
├── MONGODB_QUICKSTART.md  # ← Start here (5 min)
├── LOCAL_SETUP.md         # ← Full setup guide
├── MONGODB_SETUP.md       # ← MongoDB details
├── RENDER_DEPLOYMENT.md   # ← Production deploy
└── PROGRESS.md            # ← Project status
```

---

## 🎯 Recommended Path

### For Testing
1. Read: **MONGODB_QUICKSTART.md** (5 min)
2. Create MongoDB Atlas account
3. Start backend: `npm run dev`
4. Start frontend: `npm run dev`
5. Test signup

### For Production
1. Complete testing above
2. Read: **RENDER_DEPLOYMENT.md**
3. Push code to GitHub
4. Deploy backend to Render
5. Deploy frontend to Render
6. Done!

### For Learning
1. Read: **README.md** (overview)
2. Read: **MONGODB_SETUP.md** (deep dive)
3. Read: **backend/README.md** (API)
4. Read: **PROGRESS.md** (status)

---

## 🔗 Important Links

### Project
- **GitHub**: [Your repo]
- **Frontend**: http://localhost:5173/Vault-Finance/
- **Backend**: http://localhost:3001
- **API Docs**: [backend/README.md](./backend/README.md)

### External
- **MongoDB**: https://www.mongodb.com
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **MongoDB Shell**: https://docs.mongodb.com/mongodb-shell/
- **MongoDB Compass**: https://www.mongodb.com/try/download/compass
- **Mongoose**: https://mongoosejs.com/
- **Express**: https://expressjs.com/
- **React**: https://react.dev/
- **Render**: https://render.com/

---

## 💡 Pro Tips

1. **Use MongoDB Compass** for GUI management of your database
   - Download: https://www.mongodb.com/try/download/compass
   - Visual way to browse collections

2. **Check backend logs** to debug issues
   - API requests logged to console
   - Database operations logged

3. **Use browser DevTools (F12)** to debug frontend
   - Network tab: Check API requests
   - Console: Check errors
   - Application: Check localStorage/cookies

4. **Keep terminal windows organized**
   - Backend terminal: Backend logs
   - Frontend terminal: Frontend logs
   - Database terminal: mongosh for inspection

5. **Test with curl** to verify API works:
   ```bash
   curl http://localhost:3001/health
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

---

## ✅ Success Indicators

You'll know everything is working when you see:

1. **Backend Terminal**:
   ```
   ✅ Connected to MongoDB
   🚀 Server running on http://localhost:3001
   ```

2. **Frontend Terminal**:
   ```
   VITE v5.x.x  ready in 1234 ms
   ➜  Local:   http://localhost:5173/Vault-Finance/
   ```

3. **Browser Network Tab** (F12):
   - Successful API calls: Status 200
   - No CORS errors
   - Requests to http://localhost:3001/api/*

4. **Database**:
   - Users collection has your test user
   - Can see transactions if created

---

## 🚀 Next: Deployment

After verifying everything works locally:

1. See **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)**
2. Deploy backend to Render
3. Deploy frontend to Render
4. Your app is live on the internet!

---

## 📞 Need Help?

1. Check **[PROGRESS.md](./PROGRESS.md)** for status and known issues
2. Check documentation files for detailed steps
3. Check browser console (F12) for errors
4. Check backend terminal for API errors
5. Verify MongoDB connection string

---

**Ready to get started?** 👇

### ⭐ Fastest Path (5 minutes)
→ Read **[MONGODB_QUICKSTART.md](./MONGODB_QUICKSTART.md)**

### 📖 Full Setup (15 minutes)
→ Read **[LOCAL_SETUP.md](./LOCAL_SETUP.md)**

### 🚀 Deploy to Production
→ Read **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)**

---

**Happy coding! 🎉**

# 🎯 Vault Finance - Quick Reference Card

## 🚀 GETTING STARTED (Choose One)

### Option 1: MongoDB Atlas (⭐ Easiest)
```bash
1. Go to: mongodb.com/cloud/atlas
2. Create account & cluster (3 min)
3. Get connection string
4. Update backend/.env
5. cd backend && npm run dev
6. npm run dev (in new terminal)
7. Open: http://localhost:5173/Vault-Finance/
```

### Option 2: Local MongoDB
```bash
1. Install from: mongodb.com (5 min)
2. Run: mongod
3. cd backend && npm run dev
4. npm run dev (in new terminal)
5. Open: http://localhost:5173/Vault-Finance/
```

### Option 3: One-Click Start (Windows)
```bash
start-dev.bat
# Done! Opens 2 windows automatically
```

---

## 📚 DOCUMENTATION QUICK LINKS

| Situation | File |
|-----------|------|
| **5-min setup** | [MONGODB_QUICKSTART.md](./MONGODB_QUICKSTART.md) |
| **Full setup** | [LOCAL_SETUP.md](./LOCAL_SETUP.md) |
| **Deep MongoDB** | [MONGODB_SETUP.md](./MONGODB_SETUP.md) |
| **API docs** | [backend/README.md](./backend/README.md) |
| **Production** | [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) |
| **Status** | [PROGRESS.md](./PROGRESS.md) |
| **Everything** | [GETTING_STARTED.md](./GETTING_STARTED.md) |

---

## 🔧 ENVIRONMENT SETUP

### Frontend `.env`
```
VITE_API_URL=http://localhost:3001
```

### Backend `.env`
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
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vault-finance?retryWrites=true&w=majority
```

---

## ⚡ COMMON COMMANDS

### Startup
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
npm install
npm run dev
```

### Database
```bash
# MongoDB Shell
mongosh
use vault-finance
db.users.find()
db.transactions.find()
```

### Build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
npm run build
# Output: dist/
```

### Testing
```bash
# Health check
curl http://localhost:3001/health

# API test
curl -X GET http://localhost:3001/api/transactions
```

---

## 🌐 URLS

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173/Vault-Finance/ |
| Backend | http://localhost:3001 |
| Health | http://localhost:3001/health |
| API | http://localhost:3001/api/* |

---

## 📊 API ENDPOINTS

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/current` - Get user
- `POST /api/auth/reset-password` - Reset

### Transactions
- `GET /api/transactions` - Get all
- `POST /api/transactions` - Create
- `PUT /api/transactions/:id` - Update
- `DELETE /api/transactions/:id` - Delete
- `GET /api/transactions/type/:type` - Filter

### Dashboard
- `GET /api/dashboard/stats` - Statistics
- `GET /api/dashboard/category-breakdown/:type` - Categories
- `GET /api/dashboard/monthly-trend` - Trends

---

## 🆘 TROUBLESHOOTING

### MongoDB Connection Failed
```
✓ Check: Is MongoDB running?
✓ Check: Is connection string correct?
✓ Check: Atlas IP whitelisted?
→ Solution: See MONGODB_QUICKSTART.md
```

### Port 3001 Already in Use
```
✓ Change PORT in backend/.env
✓ Or: lsof -i :3001 (find process)
✓ Or: netstat -ano | findstr :3001 (Windows)
```

### Frontend Can't Connect to Backend
```
✓ Check: Is backend running?
✓ Check: VITE_API_URL in .env correct?
✓ Check: F12 console for CORS errors
→ Solution: See LOCAL_SETUP.md
```

### MONGODB_URI Not Found
```
✓ Check: .env file exists in backend/
✓ Check: Not named .env.example
✓ Check: Has MONGODB_URI line
✓ Restart: npm run dev
```

---

## ✅ SUCCESS CHECKLIST

After starting:

- [ ] Backend: "✅ Connected to MongoDB"
- [ ] Frontend: "ready in XXms"
- [ ] Health check: `curl http://localhost:3001/health` → OK
- [ ] Browser opens without errors
- [ ] Signup works
- [ ] Dashboard displays
- [ ] User in database

---

## 🚀 DEPLOYMENT

### To Render (Production)

1. See: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
2. Create MongoDB Atlas account
3. Push to GitHub
4. Deploy backend to Render
5. Deploy frontend to Render
6. Set environment variables
7. Live! 🎉

---

## 📁 PROJECT STRUCTURE

```
.
├── src/                # Frontend
│   ├── services/       # API calls
│   ├── App.tsx
│   └── main.tsx
├── backend/            # Express API
│   ├── src/
│   │   ├── mongodb.ts
│   │   ├── models.ts
│   │   ├── db.ts
│   │   ├── server.ts
│   │   └── routes/
│   └── .env
├── .env               # Frontend config
├── render.yaml        # Render config
└── [docs]            # Documentation
```

---

## 🎓 TECH STACK

**Frontend**: React 19 + TypeScript + Vite + Recharts
**Backend**: Express + TypeScript + Mongoose
**Database**: MongoDB (Local or Atlas)
**Deployment**: Render

---

## 💬 COMMON QUESTIONS

**Q: Do I need to install MongoDB?**
A: No! Use MongoDB Atlas cloud version (or optionally install locally)

**Q: Where do I find my data?**
A: MongoDB Atlas dashboard → Collections tab (or use mongosh)

**Q: How do I deploy?**
A: See RENDER_DEPLOYMENT.md (5-10 minutes)

**Q: Is my data secure?**
A: For production: Add bcrypt hashing and JWT tokens

**Q: Can I use existing MongoDB?**
A: Yes! Update MONGODB_URI in .env

---

## 📞 QUICK HELP

- **Getting Started**: [GETTING_STARTED.md](./GETTING_STARTED.md)
- **Setup**: [MONGODB_QUICKSTART.md](./MONGODB_QUICKSTART.md)
- **Full Guide**: [LOCAL_SETUP.md](./LOCAL_SETUP.md)
- **Project Status**: [PROGRESS.md](./PROGRESS.md)
- **API Docs**: [backend/README.md](./backend/README.md)

---

## 🎯 NEXT STEP

👉 Go to: **[MONGODB_QUICKSTART.md](./MONGODB_QUICKSTART.md)**

**Time: 5 minutes**
**Difficulty: Easy**
**Result: Running app with MongoDB**

---

**Last Updated**: 2024
**Status**: ✅ Ready to Run

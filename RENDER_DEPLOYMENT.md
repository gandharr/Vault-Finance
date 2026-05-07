# Vault Finance - Render Deployment Guide

## Overview
This guide will help you deploy the Vault Finance application and its backend API to Render with MongoDB.

## Prerequisites
- GitHub account (to connect your repository)
- Render account (free tier available)
- MongoDB Atlas account (free: https://www.mongodb.com/cloud/atlas) OR MongoDB local instance

## Step 1: Push to GitHub

First, ensure your project is pushed to GitHub:

```bash
git add .
git commit -m "Initial commit: Vault Finance with backend and MongoDB"
git remote add origin https://github.com/YOUR_USERNAME/vault-finance.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Click "Connect" and get your connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
   ```
5. **Important**: Whitelist Render's IP range or use `0.0.0.0/0` to allow all IPs

See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed instructions.

### Option B: Render PostgreSQL (If you prefer SQL)
Use Render's built-in PostgreSQL instead of MongoDB - requires code changes to use TypeORM/Prisma.

## Step 3: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `vault-finance-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/vault-finance?retryWrites=true&w=majority`
6. Click "Create Web Service"

**Save the service URL** (e.g., `https://vault-finance-api.onrender.com`)

## Step 4: Deploy Frontend on Render

1. In Render Dashboard, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `vault-finance`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variables:
   - `VITE_API_URL`: `https://vault-finance-api.onrender.com` (from Step 3)
5. Click "Create Static Site"

**Your frontend URL** will be: `https://vault-finance.onrender.com`

## Step 5: Verify Deployment

1. Visit your frontend URL
2. Try signing up with a test account
3. Check MongoDB Atlas to see if user was created
4. Check browser console for any errors

## Local Development

### With Local MongoDB

1. **Install MongoDB**:
   - Windows: https://www.mongodb.com/try/download/community
   - macOS: `brew install mongodb-community`
   - Linux: `sudo apt-get install mongodb`

2. **Start MongoDB**:
```bash
mongod
```

3. **Backend .env file**:
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vault-finance
```

4. **Start Backend**:
```bash
cd backend
npm run dev
```

5. **Frontend .env file**:
```
VITE_API_URL=http://localhost:3001
```

6. **Start Frontend**:
```bash
npm run dev
```

### With MongoDB Atlas

1. Get connection string from MongoDB Atlas
2. Create `backend/.env`:
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vault-finance?retryWrites=true&w=majority
```

3. Start backend: `npm run dev`
4. Start frontend: `npm run dev`

## Data Persistence

- **Development**: Data stored in MongoDB (local or Atlas)
- **Production**: Data persisted in MongoDB Atlas
- **Backup**: Use MongoDB Atlas backup features or export via mongodump

## Troubleshooting

### MongoDB Connection Issues
- Check `MONGODB_URI` format
- Verify MongoDB service is running
- For Atlas: Whitelist Render IP or use `0.0.0.0/0`
- Check username/password has no special characters (URL encode if needed)

### Build Failures
- Clear backend/node_modules: `rm -rf backend/node_modules && cd backend && npm install`
- Check TypeScript: `cd backend && npm run build`
- View Render logs for detailed errors

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` environment variable is set correctly
- Check backend is running and healthy
- Look at browser console for CORS or connection errors

### Database Empty After Redeployment
- MongoDB data persists across redeployments
- Check correct database name in connection string
- Verify database credentials

## Production Considerations

1. **Security**:
   - Use strong passwords for MongoDB
   - Never commit `.env` files with credentials
   - Use Render's secret management for environment variables
   - Consider adding API authentication (JWT tokens)

2. **Performance**:
   - Enable MongoDB connection pooling (automatic with Mongoose)
   - Add database indexes for frequently queried fields
   - Consider caching strategies

3. **Monitoring**:
   - Enable Render logs for debugging
   - Set up MongoDB Atlas monitoring
   - Consider error tracking service (Sentry, etc.)

4. **Scaling**:
   - Upgrade MongoDB cluster if needed
   - Add more Render resources if needed
   - Implement API rate limiting

## Upgrading from JSON to MongoDB

If you were using the old JSON file storage:
1. Manually migrate data or re-create accounts
2. All new data will be saved to MongoDB automatically
3. Delete `backend/data` folder (no longer needed)

## Next Steps

1. ✅ Deployed backend to Render
2. ✅ Deployed frontend to Render
3. ✅ Configured MongoDB connection
4. TODO: Add JWT authentication
5. TODO: Implement transaction creation form
6. TODO: Add more analytics features
7. TODO: Set up CI/CD pipeline

## Support

- Backend API: See `backend/README.md`
- MongoDB Setup: See `MONGODB_SETUP.md`
- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.mongodb.com/

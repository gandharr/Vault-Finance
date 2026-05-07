import express from 'express'
import cors from 'cors'
import { connectDB } from './mongodb'
import authRoutes from './routes/auth'
import transactionRoutes from './routes/transactions'
import dashboardRoutes from './routes/dashboard'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// Connect to MongoDB and start server
async function startServer() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/health`)
      console.log(`💾 MongoDB URI: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/vault-finance'}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    console.error('\n📚 For MongoDB setup instructions, see LOCAL_SETUP.md')
    console.error('   Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas\n')
    process.exit(1)
  }
}

startServer()

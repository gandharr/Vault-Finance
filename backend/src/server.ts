import express from 'express'
import cors from 'cors'
import { connectDB } from './mongodb.js'
import authRoutes from './routes/auth.js'
import transactionRoutes from './routes/transactions.js'
import dashboardRoutes from './routes/dashboard.js'

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
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Health check ready on /health`)
      console.log(`💾 MongoDB URI configured: ${Boolean(process.env.MONGODB_URI)}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    console.error('\n📚 For MongoDB setup instructions, see LOCAL_SETUP.md')
    console.error('   Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas\n')
    process.exit(1)
  }
}

startServer()

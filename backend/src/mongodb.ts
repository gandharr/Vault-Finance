import 'dotenv/config'
import mongoose from 'mongoose'

// Load MongoDB URI from environment (backend/.env) or fallback to local
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vault-finance'

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

export default mongoose

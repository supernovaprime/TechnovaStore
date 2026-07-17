import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const dropUsernameIndex = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/technova-store'
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    const db = mongoose.connection.db
    if (!db) throw new Error('Database not found')

    const indexes = await db.collection('users').indexes()
    const usernameIndex = indexes.find((idx: any) => idx.name === 'username_1')

    if (usernameIndex) {
      await db.collection('users').dropIndex('username_1')
      console.log('Dropped stale username_1 index from users collection')
    } else {
      console.log('No username_1 index found — nothing to drop')
    }

    process.exit(0)
  } catch (error) {
    console.error('Error dropping username index:', error)
    process.exit(1)
  }
}

dropUsernameIndex()

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from '../models/User.model'
import { UserRole } from '../types/auth.types'

dotenv.config()

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/technova-store'
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    const admin = await User.findOne({ email: 'admin@technova-store.com' })

    if (admin) {
      admin.password = 'admin1234'
      admin.role = UserRole.ADMIN
      admin.isActive = true
      admin.isEmailVerified = true
      await admin.save()
      console.log('Admin user reset successfully:')
      console.log('Email:', admin.email)
      console.log('Role:', admin.role)
      console.log('Password hash updated via model pre-save hook')
    } else {
      await User.create({
        name: 'Admin',
        email: 'admin@technova-store.com',
        password: 'admin1234',
        role: UserRole.ADMIN,
        isActive: true,
        isEmailVerified: true
      })
      console.log('Admin user created successfully:')
      console.log('Email: admin@technova-store.com')
      console.log('Role: admin')
    }

    process.exit(0)
  } catch (error) {
    console.error('Error seeding admin:', error)
    process.exit(1)
  }
}

seedAdmin()

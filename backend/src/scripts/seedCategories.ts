import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Category } from '../models/Category.model'

dotenv.config()

const seedCategories = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/technova-store'
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    const categories = [
      { name: 'Phones', icon: 'smartphone' },
      { name: 'Laptops', icon: 'laptop' },
      { name: 'Accessories', icon: 'headphones' }
    ]

    for (const cat of categories) {
      const existing = await Category.findOne({ name: cat.name })
      if (!existing) {
        await Category.create(cat)
        console.log(`Created category: ${cat.name}`)
      } else {
        console.log(`Category already exists: ${cat.name}`)
      }
    }

    console.log('Category seeding complete')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding categories:', error)
    process.exit(1)
  }
}

seedCategories()

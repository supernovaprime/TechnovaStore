import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Brand } from '../models/Brand.model'

dotenv.config()

const seedBrands = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/technova-store'
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    const brands = [
      'Apple', 'Samsung', 'Tecno', 'Itel', 'Oppo', 'Infinix', 'Huawei',
      'HP', 'Lenovo', 'Asus', 'Acer', 'Dell', 'Toshiba'
    ]

    for (const name of brands) {
      const existing = await Brand.findOne({ name })
      if (!existing) {
        await Brand.create({ name })
        console.log(`Created brand: ${name}`)
      } else {
        console.log(`Brand already exists: ${name}`)
      }
    }

    console.log('Brand seeding complete')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding brands:', error)
    process.exit(1)
  }
}

seedBrands()

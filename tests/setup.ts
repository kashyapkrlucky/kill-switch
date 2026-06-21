import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { connectToDatabase } from '../src/core/lib/database'

declare global {
  var connectToDatabase: () => Promise<typeof mongoose>
  var __MONGOINSTANCE__: MongoMemoryServer | undefined
  var __MONGOURI__: string | undefined
}

let mongoServer: MongoMemoryServer

// Global setup - runs once before all tests
beforeAll(async () => {
  if (!global.__MONGOINSTANCE__) {
    mongoServer = await MongoMemoryServer.create()
    global.__MONGOINSTANCE__ = mongoServer
    global.__MONGOURI__ = mongoServer.getUri()
    console.log('MongoDB started at:', global.__MONGOURI__)
  }
}, 30000)

// Global teardown - runs once after all tests
afterAll(async () => {
  if (global.__MONGOINSTANCE__) {
    console.log('Stopping MongoDB...')
    await global.__MONGOINSTANCE__.stop()
    global.__MONGOINSTANCE__ = undefined
    global.__MONGOURI__ = undefined
  }
}, 30000)

// Setup for each test file
beforeEach(async () => {
  // Connect to the global MongoDB instance
  if (mongoose.connection.readyState === 0) {
    const uri = global.__MONGOURI__
    if (!uri) {
      throw new Error('MongoDB URI not found in global')
    }
    await mongoose.connect(uri)
  }
  
  // Wait for connection to be fully established
  let attempts = 0
  while (mongoose.connection.readyState !== 1 && attempts < 10) {
    await new Promise(resolve => setTimeout(resolve, 100))
    attempts++
  }
  
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Failed to establish MongoDB connection')
  }
  
  // Override the connectToDatabase function for tests
  global.connectToDatabase = async () => {
    if (mongoose.connection.readyState === 0) {
      const uri = global.__MONGOURI__
      if (!uri) {
        throw new Error('MongoDB URI not found in global')
      }
      await mongoose.connect(uri)
    }
    return mongoose
  }
  
  // Override the mock to use our test database
  ;(connectToDatabase as jest.Mock).mockImplementation(global.connectToDatabase)
})

// Cleanup after each test file
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect()
  }
})

// Clear collections before each test
beforeEach(async () => {
  // Wait a bit for connection to be ready
  await new Promise(resolve => setTimeout(resolve, 50))
  
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany({})
    }
  }
})

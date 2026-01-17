import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

describe('Database Setup Test', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  it('should connect to MongoDB', async () => {
    expect(mongoose.connection.readyState).toBe(1)
  })

  it('should be able to create and find documents', async () => {
    const testSchema = new mongoose.Schema({
      name: String,
      value: Number
    })
    const TestModel = mongoose.model('Test', testSchema)

    const doc = new TestModel({ name: 'test', value: 42 })
    await doc.save()

    const found = await TestModel.findOne({ name: 'test' })
    expect(found).toBeTruthy()
    expect(found?.value).toBe(42)
  })
})

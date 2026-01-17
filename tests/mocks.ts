// Mock environment variables before any imports
process.env.MONGODB_URI = 'mongodb://localhost:27017/test'

// Mock jose library to avoid ES module issues
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock-jwt-token')
  })),
  jwtVerify: jest.fn().mockResolvedValue({ sub: '507f1f77bcf86cd799439011' })
}))

// Mock auth module to prevent database connection during imports
jest.mock('@/core/lib/auth', () => ({
  getUserIdFromCookie: jest.fn().mockResolvedValue('507f1f77bcf86cd799439011')
}))

// Mock database module to prevent real database connections
jest.mock('@/core/lib/database', () => ({
  connectToDatabase: jest.fn().mockImplementation(async () => {
    // This will be overridden in test setup
    const mongoose = await import('mongoose')
    return mongoose.default
  })
}))

// Mock Redis cache
jest.mock('@/core/lib/redis', () => ({
  cache: {
    del: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  }
}))

// Mock logger
jest.mock('@/core/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }
}))

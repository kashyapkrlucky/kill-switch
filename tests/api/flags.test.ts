import mongoose from 'mongoose'
import { GET, POST } from '@/app/api/flags/route'
import { GET as GET_BY_ID, PATCH as UPDATE_BY_ID, DELETE as DELETE_BY_ID } from '@/app/api/flags/[id]/route'
import { createAuthenticatedRequest, mockUserId } from '../helpers/test-helpers'
import { Flag } from '@/core/models/Flag'
import { Project } from '@/core/models/Project'
import { getUserIdFromCookie } from '@/core/lib/auth'

// Mock the auth module
jest.mock('@/core/lib/auth')

describe('/api/flags', () => {
  let testProject: InstanceType<typeof Project>

  beforeEach(async () => {
    // Reset mock to default behavior (authenticated)
    ;(getUserIdFromCookie as jest.Mock).mockResolvedValue(mockUserId)
    
    testProject = new Project({
      name: 'Test Project',
      code: 'TST',
      description: 'Test project for flags',
      owner: new mongoose.Types.ObjectId(mockUserId),
      members: [new mongoose.Types.ObjectId(mockUserId)],
    })
    await testProject.save()
  })

  describe('GET /api/flags', () => {
    it('should return user flags when authenticated', async () => {
      const flag = new Flag({
        name: 'Test Flag',
        code: 'TST0001',
        description: 'Test flag description',
        project: testProject._id,
        status: 'active'
      })
      await flag.save()

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].name).toBe('Test Flag')
      expect(data.data[0].project.name).toBe('Test Project')
    })

    it('should return 400 when user not authenticated', async () => {
      // Mock unauthenticated user
      ;(getUserIdFromCookie as jest.Mock).mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('User not found')
    })

    it('should return flags sorted by creation date (newest first)', async () => {
      const flag1 = new Flag({
        name: 'First Flag',
        code: 'TST0001',
        project: testProject._id,
      })
      await flag1.save()

      await new Promise(resolve => setTimeout(resolve, 10))

      const flag2 = new Flag({
        name: 'Second Flag',
        code: 'TST0002',
        project: testProject._id,
      })
      await flag2.save()

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(2)
      expect(data.data[0].name).toBe('Second Flag')
      expect(data.data[1].name).toBe('First Flag')
    })

    it('should only return flags from user projects', async () => {
      const otherUserId = '507f1f77bcf86cd799439012'
      
      const otherProject = new Project({
        name: 'Other Project',
        code: 'OTH',
        owner: new mongoose.Types.ObjectId(otherUserId),
        members: [new mongoose.Types.ObjectId(otherUserId)],
      })
      await otherProject.save()

      const userFlag = new Flag({
        name: 'User Flag',
        code: 'TST0001',
        project: testProject._id,
      })
      await userFlag.save()

      const otherFlag = new Flag({
        name: 'Other Flag',
        code: 'OTH0001',
        project: otherProject._id,
      })
      await otherFlag.save()

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].name).toBe('User Flag')
    })
  })

  describe('POST /api/flags', () => {
    it('should create a new flag when authenticated', async () => {
      const flagData = {
        name: 'New Flag',
        description: 'New flag description',
        project: testProject._id.toString()
      }

      const request = await createAuthenticatedRequest(mockUserId, flagData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe(true)
      expect(data.data.name).toBe(flagData.name)
      expect(data.data.description).toBe(flagData.description)
      expect(data.data.code).toBe('TST0001')
      expect(data.data.project.name).toBe('Test Project')
    })

    it('should return 400 when user not authenticated', async () => {
      // Mock unauthenticated user
      ;(getUserIdFromCookie as jest.Mock).mockResolvedValue(null)

      const flagData = {
        name: 'New Flag',
        project: testProject._id.toString()
      }

      const request = await createAuthenticatedRequest(mockUserId, flagData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('User not found')
    })

    it('should return 400 when project not found', async () => {
      const flagData = {
        name: 'New Flag',
        project: new mongoose.Types.ObjectId().toString()
      }

      const request = await createAuthenticatedRequest(mockUserId, flagData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Project not found')
    })

    it('should generate sequential flag codes', async () => {
      const flagData1 = {
        name: 'First Flag',
        project: testProject._id.toString()
      }

      const request1 = await createAuthenticatedRequest(mockUserId, flagData1)
      const response1 = await POST(request1)
      const data1 = await response1.json()

      expect(data1.data.code).toBe('TST0001')

      const flagData2 = {
        name: 'Second Flag',
        project: testProject._id.toString()
      }

      const request2 = await createAuthenticatedRequest(mockUserId, flagData2)
      const response2 = await POST(request2)
      const data2 = await response2.json()

      expect(data2.data.code).toBe('TST0002')
    })

    it('should handle validation errors', async () => {
      const invalidFlagData = {
        description: 'Missing required name and project'
      }

      const request = await createAuthenticatedRequest(mockUserId, invalidFlagData)
      const response = await POST(request)

      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/flags/[id]', () => {
    it('should return a specific flag when authenticated', async () => {
      const flag = new Flag({
        name: 'Test Flag',
        code: 'TST0001',
        project: testProject._id,
      })
      await flag.save()

      const mockRequest = new Request('http://localhost:3000/api/flags/' + flag._id)
      const mockContext = { params: { id: flag._id.toString() } }
      
      const response = await GET_BY_ID(mockRequest, mockContext)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe(true)
      expect(data.data.name).toBe('Test Flag')
    })

    it('should return 400 when flag not found', async () => {
      const mockRequest = new Request('http://localhost:3000/api/flags/507f1f77bcf86cd799439011')
      const mockContext = { params: { id: '507f1f77bcf86cd799439011' } }
      
      const response = await GET_BY_ID(mockRequest, mockContext)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('User not found or flag not found')
    })
  })

  describe('PATCH /api/flags/[id]', () => {
    it('should update a flag when authenticated', async () => {
      const flag = new Flag({
        name: 'Original Flag',
        code: 'TST0001',
        project: testProject._id,
      })
      await flag.save()

      const updateData = {
        name: 'Updated Flag',
        description: 'Updated description',
        status: 'inactive'
      }

      const mockRequest = await createAuthenticatedRequest(mockUserId, updateData)
      const mockContext = { params: { id: flag._id.toString() } }
      
      const response = await UPDATE_BY_ID(mockRequest, mockContext)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.name).toBe('Updated Flag')
      expect(data.data.description).toBe('Updated description')
      expect(data.data.status).toBe('inactive')
    })

    it('should update only provided fields', async () => {
      const flag = new Flag({
        name: 'Original Flag',
        code: 'TST0001',
        description: 'Original description',
        project: testProject._id,
      })
      await flag.save()

      const updateData = {
        name: 'New Name Only'
      }

      const mockRequest = await createAuthenticatedRequest(mockUserId, updateData)
      const mockContext = { params: { id: flag._id.toString() } }
      
      const response = await UPDATE_BY_ID(mockRequest, mockContext)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.name).toBe('New Name Only')
      expect(data.data.description).toBe('Original description')
    })
  })

  describe('DELETE /api/flags/[id]', () => {
    it('should delete a flag when authenticated', async () => {
      const flag = new Flag({
        name: 'Flag to Delete',
        code: 'TST0001',
        project: testProject._id,
      })
      await flag.save()

      const mockRequest = new Request('http://localhost:3000/api/flags/' + flag._id)
      const mockContext = { params: { id: flag._id.toString() } }
      
      const response = await DELETE_BY_ID(mockRequest, mockContext)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toBe('Flag deleted')

      const deletedFlag = await Flag.findById(flag._id)
      expect(deletedFlag).toBeNull()
    })

    it('should return 400 when trying to delete non-existent flag', async () => {
      const mockRequest = new Request('http://localhost:3000/api/flags/507f1f77bcf86cd799439011')
      const mockContext = { params: { id: '507f1f77bcf86cd799439011' } }
      
      const response = await DELETE_BY_ID(mockRequest, mockContext)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('User not found or flag not found')
    })
  })
})

import mongoose from 'mongoose'
import { GET, POST } from '@/app/api/projects/route'
import { createAuthenticatedRequest, mockProjectData, mockUserId } from '../helpers/test-helpers'
import { Project } from '@/core/models/Project'
import { getUserIdFromCookie } from '@/core/lib/auth'

// Mock the auth module
jest.mock('@/core/lib/auth')

describe('/api/projects', () => {
  beforeEach(async () => {
    // Reset mock to default behavior (authenticated)
    ;(getUserIdFromCookie as jest.Mock).mockResolvedValue(mockUserId)
  })

  describe('GET', () => {
    it('should return user projects when authenticated', async () => {
      const project = new Project({
        name: 'Test Project',
        code: 'TST',
        description: 'Test description',
        owner: new mongoose.Types.ObjectId(mockUserId),
        members: [new mongoose.Types.ObjectId(mockUserId)],
      })
      await project.save()

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].name).toBe('Test Project')
    })

    it('should return 400 when user not authenticated', async () => {
      // Mock unauthenticated user
      ;(getUserIdFromCookie as jest.Mock).mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('User not found')
    })

    it('should return projects where user is owner or member', async () => {
      const otherUserId = '507f1f77bcf86cd799439012'
      
      const ownedProject = new Project({
        name: 'Owned Project',
        code: 'OWN',
        description: 'Owned by user',
        owner: new mongoose.Types.ObjectId(mockUserId),
        members: [new mongoose.Types.ObjectId(mockUserId)],
      })
      
      const memberProject = new Project({
        name: 'Member Project',
        code: 'MBR',
        description: 'User is member',
        owner: new mongoose.Types.ObjectId(otherUserId),
        members: [
          new mongoose.Types.ObjectId(otherUserId),
          new mongoose.Types.ObjectId(mockUserId)
        ],
      })
      
      const otherProject = new Project({
        name: 'Other Project',
        code: 'OTH',
        description: 'Not related to user',
        owner: new mongoose.Types.ObjectId(otherUserId),
        members: [new mongoose.Types.ObjectId(otherUserId)],
      })

      await Promise.all([ownedProject.save(), memberProject.save(), otherProject.save()])

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(2)
      expect(data.data.map((p: { name: string }) => p.name)).toEqual(['Owned Project', 'Member Project'])
    })
  })

  describe('POST', () => {
    it('should create a new project when authenticated', async () => {
      const request = await createAuthenticatedRequest(mockUserId, mockProjectData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe(true)
      expect(data.data.name).toBe(mockProjectData.name)
      expect(data.data.description).toBe(mockProjectData.description)
      expect(data.data.code).toBe('TES')
      expect(data.data.owner).toBeDefined()
      expect(data.data.members).toHaveLength(1)
    })

    it('should return 400 when user not authenticated', async () => {
      // Mock unauthenticated user
      ;(getUserIdFromCookie as jest.Mock).mockResolvedValue(null)

      const request = await createAuthenticatedRequest(mockUserId, mockProjectData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('User not found')
    })

    it('should generate project code from first 3 letters of name', async () => {
      const longNameProject = {
        name: 'Very Long Project Name',
        description: 'Testing code generation'
      }

      const request = await createAuthenticatedRequest(mockUserId, longNameProject)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.code).toBe('VER')
    })

    it('should handle validation errors', async () => {
      const invalidProject = {
        description: 'Missing required name field'
      }

      const request = await createAuthenticatedRequest(mockUserId, invalidProject)
      const response = await POST(request)

      expect(response.status).toBe(500)
    })

    it('should set user as both owner and member', async () => {
      const request = await createAuthenticatedRequest(mockUserId, mockProjectData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.owner).toBe(mockUserId)
      expect(data.data.members).toContain(mockUserId)
      expect(data.data.members).toHaveLength(1)
    })
  })
})

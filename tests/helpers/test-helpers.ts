export async function createMockAuthCookie(): Promise<string> {
  // Use the mocked SignJWT that returns a fixed token
  const token = 'mock-jwt-token'
  return `auth-token=${token}; Path=/; HttpOnly; SameSite=Strict`
}

export function createMockRequest(body?: Record<string, unknown>, headers?: Record<string, string>): Request {
  const mockHeaders = new Headers()
  
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      mockHeaders.set(key, value)
    })
  }
  
  return new Request('http://localhost:3000/api/test', {
    method: 'POST',
    headers: mockHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })
}

export async function createAuthenticatedRequest(userId: string, body?: Record<string, unknown>): Promise<Request> {
  const cookie = await createMockAuthCookie()
  return createMockRequest(body, {
    'Cookie': cookie
  })
}

export const mockUserId = '507f1f77bcf86cd799439011'
export const mockProjectData = {
  name: 'Test Project',
  description: 'A test project for testing'
}

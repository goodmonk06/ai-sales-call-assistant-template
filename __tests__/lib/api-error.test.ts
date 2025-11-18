import { describe, it, expect } from 'vitest'
import { ApiError, handleApiError } from '@/lib/api-error'
import { z } from 'zod'

describe('ApiError', () => {
  it('should create an ApiError with correct properties', () => {
    const error = new ApiError(404, 'Not found', { id: '123' })

    expect(error.statusCode).toBe(404)
    expect(error.message).toBe('Not found')
    expect(error.details).toEqual({ id: '123' })
    expect(error.name).toBe('ApiError')
  })
})

describe('handleApiError', () => {
  it('should handle Zod validation errors', () => {
    const schema = z.object({
      name: z.string().min(1),
      age: z.number(),
    })

    try {
      schema.parse({ name: '', age: 'not a number' })
    } catch (error) {
      const response = handleApiError(error)
      const json = response.json()

      expect(response.status).toBe(400)
    }
  })

  it('should handle custom ApiError', () => {
    const error = new ApiError(404, 'Resource not found')
    const response = handleApiError(error)

    expect(response.status).toBe(404)
  })

  it('should handle Prisma P2002 error (unique constraint)', () => {
    const prismaError = {
      code: 'P2002',
      meta: { target: ['email'] },
    }

    const response = handleApiError(prismaError)
    expect(response.status).toBe(409)
  })

  it('should handle Prisma P2025 error (record not found)', () => {
    const prismaError = {
      code: 'P2025',
      meta: {},
    }

    const response = handleApiError(prismaError)
    expect(response.status).toBe(404)
  })

  it('should handle generic errors', () => {
    const error = new Error('Something went wrong')
    const response = handleApiError(error)

    expect(response.status).toBe(500)
  })

  it('should handle unknown errors', () => {
    const error = 'string error'
    const response = handleApiError(error)

    expect(response.status).toBe(500)
  })
})

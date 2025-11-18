import { describe, it, expect } from 'vitest'
import { scriptTemplateSchema, callLogSchema, validateRequest } from '@/lib/validations'

describe('ScriptTemplate Validation', () => {
  it('should validate a valid script template', () => {
    const validData = {
      name: '歯科医院向けスクリプト',
      targetProfile: '歯科医院',
      purpose: 'アポ取得',
      bodyMarkdown: '# スクリプト本文\n\nこんにちは',
    }

    const result = scriptTemplateSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject a script template with empty name', () => {
    const invalidData = {
      name: '',
      targetProfile: '歯科医院',
      purpose: 'アポ取得',
      bodyMarkdown: '# スクリプト本文',
    }

    const result = scriptTemplateSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject a script template with too long name', () => {
    const invalidData = {
      name: 'a'.repeat(201),
      targetProfile: '歯科医院',
      purpose: 'アポ取得',
      bodyMarkdown: '# スクリプト本文',
    }

    const result = scriptTemplateSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject a script template with missing fields', () => {
    const invalidData = {
      name: 'テストスクリプト',
      targetProfile: '歯科医院',
    }

    const result = scriptTemplateSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('CallLog Validation', () => {
  it('should validate a valid call log', () => {
    const validData = {
      scriptTemplateId: 'test-id',
      callDate: '2025-11-18',
      outcome: 'アポ獲得',
      notes: '通話は順調でした。',
    }

    const result = callLogSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject a call log with invalid date', () => {
    const invalidData = {
      scriptTemplateId: 'test-id',
      callDate: 'invalid-date',
      outcome: 'アポ獲得',
      notes: '通話メモ',
    }

    const result = callLogSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject a call log with empty notes', () => {
    const invalidData = {
      scriptTemplateId: 'test-id',
      callDate: '2025-11-18',
      outcome: 'アポ獲得',
      notes: '',
    }

    const result = callLogSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject a call log with too long notes', () => {
    const invalidData = {
      scriptTemplateId: 'test-id',
      callDate: '2025-11-18',
      outcome: 'アポ獲得',
      notes: 'a'.repeat(5001),
    }

    const result = callLogSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('validateRequest helper', () => {
  it('should return success with valid data', () => {
    const validData = {
      name: 'テスト',
      targetProfile: '歯科医院',
      purpose: 'アポ取得',
      bodyMarkdown: 'スクリプト',
    }

    const result = validateRequest(scriptTemplateSchema, validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validData)
    }
  })

  it('should return errors with invalid data', () => {
    const invalidData = {
      name: '',
      targetProfile: '歯科医院',
    }

    const result = validateRequest(scriptTemplateSchema, invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors).toBeDefined()
    }
  })
})

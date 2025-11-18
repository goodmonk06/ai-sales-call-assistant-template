import { z } from 'zod'

// ScriptTemplate バリデーション
export const scriptTemplateSchema = z.object({
  name: z.string().min(1, '名前は必須です').max(200, '名前は200文字以内で入力してください'),
  targetProfile: z.string().min(1, '対象顧客は必須です').max(100, '対象顧客は100文字以内で入力してください'),
  purpose: z.string().min(1, '目的は必須です').max(100, '目的は100文字以内で入力してください'),
  bodyMarkdown: z.string().min(1, 'スクリプト本文は必須です').max(10000, 'スクリプト本文は10000文字以内で入力してください'),
})

export type ScriptTemplateInput = z.infer<typeof scriptTemplateSchema>

// CallLog バリデーション
export const callLogSchema = z.object({
  scriptTemplateId: z.string().min(1, 'スクリプトテンプレートは必須です'),
  callDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: '有効な日付を入力してください',
  }),
  outcome: z.string().min(1, '結果は必須です').max(50, '結果は50文字以内で入力してください'),
  notes: z.string().min(1, '通話メモは必須です').max(5000, '通話メモは5000文字以内で入力してください'),
})

export type CallLogInput = z.infer<typeof callLogSchema>

// バリデーションヘルパー
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { success: false, errors: result.error }
  }
}

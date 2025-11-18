import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCallFeedback } from '@/lib/openai'
import { callLogSchema } from '@/lib/validations'
import { handleApiError, ApiError } from '@/lib/api-error'

// POST /api/calls - 通話ログ作成（AI フィードバック付き）
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // バリデーション
    const validated = callLogSchema.parse(body)

    // スクリプトテンプレートを取得
    const scriptTemplate = await prisma.scriptTemplate.findUnique({
      where: { id: validated.scriptTemplateId },
    })

    if (!scriptTemplate) {
      throw new ApiError(404, 'Script template not found')
    }

    // AIフィードバックを生成
    let aiFeedbackMarkdown = null
    try {
      aiFeedbackMarkdown = await generateCallFeedback(
        scriptTemplate.bodyMarkdown,
        validated.notes,
        validated.outcome
      )
    } catch (error) {
      console.error('Failed to generate AI feedback:', error)
      // AIフィードバック生成に失敗してもログ作成は続行
    }

    // 通話ログを作成
    const callLog = await prisma.callLog.create({
      data: {
        scriptTemplateId: validated.scriptTemplateId,
        callDate: new Date(validated.callDate),
        outcome: validated.outcome,
        notes: validated.notes,
        aiFeedbackMarkdown,
      },
      include: {
        scriptTemplate: true,
      },
    })

    return NextResponse.json(callLog, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

// GET /api/calls - 通話ログ一覧取得
export async function GET() {
  try {
    const callLogs = await prisma.callLog.findMany({
      orderBy: {
        callDate: 'desc',
      },
      include: {
        scriptTemplate: true,
      },
      take: 50,
    })
    return NextResponse.json(callLogs)
  } catch (error) {
    return handleApiError(error)
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCallFeedback } from '@/lib/openai'

// POST /api/calls - 通話ログ作成（AI フィードバック付き）
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { scriptTemplateId, callDate, outcome, notes } = body

    if (!scriptTemplateId || !callDate || !outcome || !notes) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // スクリプトテンプレートを取得
    const scriptTemplate = await prisma.scriptTemplate.findUnique({
      where: { id: scriptTemplateId },
    })

    if (!scriptTemplate) {
      return NextResponse.json(
        { error: 'Script template not found' },
        { status: 404 }
      )
    }

    // AIフィードバックを生成
    let aiFeedbackMarkdown = null
    try {
      aiFeedbackMarkdown = await generateCallFeedback(
        scriptTemplate.bodyMarkdown,
        notes,
        outcome
      )
    } catch (error) {
      console.error('Failed to generate AI feedback:', error)
      // AIフィードバック生成に失敗してもログ作成は続行
    }

    // 通話ログを作成
    const callLog = await prisma.callLog.create({
      data: {
        scriptTemplateId,
        callDate: new Date(callDate),
        outcome,
        notes,
        aiFeedbackMarkdown,
      },
      include: {
        scriptTemplate: true,
      },
    })

    return NextResponse.json(callLog, { status: 201 })
  } catch (error) {
    console.error('Error creating call log:', error)
    return NextResponse.json(
      { error: 'Failed to create call log' },
      { status: 500 }
    )
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
    console.error('Error fetching call logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch call logs' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scriptTemplateSchema } from '@/lib/validations'
import { handleApiError } from '@/lib/api-error'

// GET /api/scripts - スクリプトテンプレート一覧取得
export async function GET() {
  try {
    const scripts = await prisma.scriptTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { callLogs: true },
        },
      },
    })
    return NextResponse.json(scripts)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/scripts - スクリプトテンプレート作成
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // バリデーション
    const validated = scriptTemplateSchema.parse(body)

    const script = await prisma.scriptTemplate.create({
      data: validated,
    })

    return NextResponse.json(script, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

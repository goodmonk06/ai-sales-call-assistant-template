import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scriptTemplateSchema } from '@/lib/validations'
import { handleApiError, ApiError } from '@/lib/api-error'

// GET /api/scripts/[id] - スクリプトテンプレート詳細取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const script = await prisma.scriptTemplate.findUnique({
      where: { id: params.id },
      include: {
        callLogs: {
          orderBy: { callDate: 'desc' },
          take: 10,
        },
      },
    })

    if (!script) {
      throw new ApiError(404, 'Script not found')
    }

    return NextResponse.json(script)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/scripts/[id] - スクリプトテンプレート更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // バリデーション
    const validated = scriptTemplateSchema.parse(body)

    const script = await prisma.scriptTemplate.update({
      where: { id: params.id },
      data: validated,
    })

    return NextResponse.json(script)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/scripts/[id] - スクリプトテンプレート削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.scriptTemplate.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}

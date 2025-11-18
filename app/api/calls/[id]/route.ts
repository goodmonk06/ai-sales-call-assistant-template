import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError, ApiError } from '@/lib/api-error'

// GET /api/calls/[id] - 通話ログ詳細取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const callLog = await prisma.callLog.findUnique({
      where: { id: params.id },
      include: {
        scriptTemplate: true,
      },
    })

    if (!callLog) {
      throw new ApiError(404, 'Call log not found')
    }

    return NextResponse.json(callLog)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/calls/[id] - 通話ログ削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.callLog.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}

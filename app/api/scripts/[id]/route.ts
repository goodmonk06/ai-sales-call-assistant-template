import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(script)
  } catch (error) {
    console.error('Error fetching script:', error)
    return NextResponse.json(
      { error: 'Failed to fetch script' },
      { status: 500 }
    )
  }
}

// PUT /api/scripts/[id] - スクリプトテンプレート更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, targetProfile, purpose, bodyMarkdown } = body

    const script = await prisma.scriptTemplate.update({
      where: { id: params.id },
      data: {
        name,
        targetProfile,
        purpose,
        bodyMarkdown,
      },
    })

    return NextResponse.json(script)
  } catch (error) {
    console.error('Error updating script:', error)
    return NextResponse.json(
      { error: 'Failed to update script' },
      { status: 500 }
    )
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
    console.error('Error deleting script:', error)
    return NextResponse.json(
      { error: 'Failed to delete script' },
      { status: 500 }
    )
  }
}

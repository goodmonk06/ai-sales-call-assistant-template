import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    console.error('Error fetching scripts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scripts' },
      { status: 500 }
    )
  }
}

// POST /api/scripts - スクリプトテンプレート作成
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, targetProfile, purpose, bodyMarkdown } = body

    if (!name || !targetProfile || !purpose || !bodyMarkdown) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const script = await prisma.scriptTemplate.create({
      data: {
        name,
        targetProfile,
        purpose,
        bodyMarkdown,
      },
    })

    return NextResponse.json(script, { status: 201 })
  } catch (error) {
    console.error('Error creating script:', error)
    return NextResponse.json(
      { error: 'Failed to create script' },
      { status: 500 }
    )
  }
}

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

interface CallLog {
  id: string
  scriptTemplate: {
    id: string
    name: string
    targetProfile: string
    purpose: string
    bodyMarkdown: string
  }
  callDate: string
  outcome: string
  notes: string
  aiFeedbackMarkdown: string | null
  createdAt: string
}

export default function CallLogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [callLog, setCallLog] = useState<CallLog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchCallLog(params.id as string)
    }
  }, [params.id])

  const fetchCallLog = async (id: string) => {
    try {
      const response = await fetch(`/api/calls/${id}`)
      if (response.ok) {
        const data = await response.json()
        setCallLog(data)
      } else {
        router.push('/calls')
      }
    } catch (error) {
      console.error('Failed to fetch call log:', error)
      router.push('/calls')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!callLog || !confirm('本当に削除しますか？')) return

    try {
      const response = await fetch(`/api/calls/${callLog.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/calls')
      } else {
        alert('削除に失敗しました')
      }
    } catch (error) {
      console.error('Failed to delete call log:', error)
      alert('削除に失敗しました')
    }
  }

  if (loading) {
    return <div className="text-center py-10">読み込み中...</div>
  }

  if (!callLog) {
    return <div className="text-center py-10">通話ログが見つかりません</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">通話ログ詳細</h1>
        <div className="flex gap-2">
          <Link
            href="/calls"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            一覧に戻る
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            削除
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              {callLog.scriptTemplate.name}
            </h2>
            <div className="text-sm text-gray-600">
              <div className="mb-1">
                対象: {callLog.scriptTemplate.targetProfile}
              </div>
              <div className="mb-1">目的: {callLog.scriptTemplate.purpose}</div>
              <div className="mb-1">
                通話日: {new Date(callLog.callDate).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </div>
              <div>
                登録日時: {new Date(callLog.createdAt).toLocaleString('ja-JP')}
              </div>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded font-medium ${
              callLog.outcome === 'アポ獲得'
                ? 'bg-green-100 text-green-800'
                : callLog.outcome === '検討中'
                ? 'bg-yellow-100 text-yellow-800'
                : callLog.outcome === '見送り'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {callLog.outcome}
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">使用したスクリプト</h3>
        <div className="prose max-w-none">
          <ReactMarkdown>{callLog.scriptTemplate.bodyMarkdown}</ReactMarkdown>
        </div>
        <div className="mt-4">
          <Link
            href={`/scripts`}
            className="text-blue-600 hover:underline text-sm"
          >
            スクリプトを編集 →
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">通話メモ</h3>
        <p className="whitespace-pre-wrap text-gray-700">{callLog.notes}</p>
      </div>

      {callLog.aiFeedbackMarkdown && (
        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-blue-900">
            AIフィードバック
          </h3>
          <div className="prose max-w-none">
            <ReactMarkdown>{callLog.aiFeedbackMarkdown}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}

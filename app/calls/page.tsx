'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CallLog {
  id: string
  scriptTemplate: {
    id: string
    name: string
    targetProfile: string
  }
  callDate: string
  outcome: string
  notes: string
  aiFeedbackMarkdown: string | null
  createdAt: string
}

export default function CallLogsPage() {
  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCallLogs()
  }, [])

  const fetchCallLogs = async () => {
    try {
      const response = await fetch('/api/calls')
      const data = await response.json()
      setCallLogs(data)
    } catch (error) {
      console.error('Failed to fetch call logs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-10">読み込み中...</div>
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">通話ログ一覧</h1>
        <Link
          href="/calls/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          新規登録
        </Link>
      </div>

      {callLogs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">通話ログがまだありません</p>
          <Link
            href="/calls/new"
            className="text-blue-600 hover:underline"
          >
            最初の通話ログを登録する
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {callLogs.map((log) => (
            <Link
              key={log.id}
              href={`/calls/${log.id}`}
              className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    {log.scriptTemplate.name}
                  </h3>
                  <div className="text-sm text-gray-600">
                    <span className="mr-4">
                      対象: {log.scriptTemplate.targetProfile}
                    </span>
                    <span className="mr-4">
                      日付: {new Date(log.callDate).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    log.outcome === 'アポ獲得'
                      ? 'bg-green-100 text-green-800'
                      : log.outcome === '検討中'
                      ? 'bg-yellow-100 text-yellow-800'
                      : log.outcome === '見送り'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {log.outcome}
                </span>
              </div>
              <p className="text-gray-700 line-clamp-2">{log.notes}</p>
              {log.aiFeedbackMarkdown && (
                <div className="mt-2 text-sm text-blue-600">
                  AIフィードバックあり
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

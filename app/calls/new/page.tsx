'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

interface ScriptTemplate {
  id: string
  name: string
  targetProfile: string
  purpose: string
}

interface CallLog {
  id: string
  scriptTemplateId: string
  callDate: string
  outcome: string
  notes: string
  aiFeedbackMarkdown: string | null
}

export default function NewCallPage() {
  const [scripts, setScripts] = useState<ScriptTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [callLog, setCallLog] = useState<CallLog | null>(null)
  const [formData, setFormData] = useState({
    scriptTemplateId: '',
    callDate: new Date().toISOString().split('T')[0],
    outcome: '',
    notes: '',
  })

  useEffect(() => {
    fetchScripts()
  }, [])

  const fetchScripts = async () => {
    try {
      const response = await fetch('/api/scripts')
      const data = await response.json()
      setScripts(data)
    } catch (error) {
      console.error('Failed to fetch scripts:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setCallLog(data)
        setSubmitted(true)
        // フォームをリセット
        setFormData({
          scriptTemplateId: '',
          callDate: new Date().toISOString().split('T')[0],
          outcome: '',
          notes: '',
        })
      } else {
        alert('登録に失敗しました')
      }
    } catch (error) {
      console.error('Failed to create call log:', error)
      alert('登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleNewEntry = () => {
    setSubmitted(false)
    setCallLog(null)
  }

  if (submitted && callLog) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-800">通話ログを登録しました</h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">登録内容</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">日付:</span> {new Date(callLog.callDate).toLocaleDateString('ja-JP')}
            </div>
            <div>
              <span className="font-medium">結果:</span> {callLog.outcome}
            </div>
            <div>
              <span className="font-medium">メモ:</span>
              <p className="mt-1 whitespace-pre-wrap">{callLog.notes}</p>
            </div>
          </div>
        </div>

        {callLog.aiFeedbackMarkdown ? (
          <div className="bg-blue-50 p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">AIフィードバック</h3>
            <div className="prose max-w-none">
              <ReactMarkdown>{callLog.aiFeedbackMarkdown}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
            <p className="text-yellow-800">AIフィードバックの生成に失敗しました</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleNewEntry}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            新しい通話ログを登録
          </button>
          <a
            href="/scripts"
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 inline-block"
          >
            スクリプト一覧へ
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">通話ログ登録</h1>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-sm text-blue-800">
          通話内容を記録すると、AIが自動的にフィードバックを生成します
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">使用したスクリプト</label>
          <select
            value={formData.scriptTemplateId}
            onChange={(e) => setFormData({ ...formData, scriptTemplateId: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">選択してください</option>
            {scripts.map((script) => (
              <option key={script.id} value={script.id}>
                {script.name} ({script.targetProfile} - {script.purpose})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">通話日</label>
          <input
            type="date"
            value={formData.callDate}
            onChange={(e) => setFormData({ ...formData, callDate: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">結果</label>
          <select
            value={formData.outcome}
            onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">選択してください</option>
            <option value="アポ獲得">アポ獲得</option>
            <option value="検討中">検討中</option>
            <option value="見送り">見送り</option>
            <option value="不在">不在</option>
            <option value="その他">その他</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">通話メモ</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={8}
            placeholder="通話の内容、顧客の反応、気づいた点などを記録してください"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            詳しく記録するほど、AIからより具体的なフィードバックが得られます
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded text-white font-semibold ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'AIフィードバックを生成中...' : '登録してAIフィードバックを取得'}
        </button>
      </form>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

interface ScriptTemplate {
  id: string
  name: string
  targetProfile: string
  purpose: string
  bodyMarkdown: string
  createdAt: string
  _count?: {
    callLogs: number
  }
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<ScriptTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingScript, setEditingScript] = useState<ScriptTemplate | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    targetProfile: '',
    purpose: '',
    bodyMarkdown: '',
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
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editingScript ? `/api/scripts/${editingScript.id}` : '/api/scripts'
    const method = editingScript ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchScripts()
        resetForm()
      } else {
        alert('保存に失敗しました')
      }
    } catch (error) {
      console.error('Failed to save script:', error)
      alert('保存に失敗しました')
    }
  }

  const handleEdit = (script: ScriptTemplate) => {
    setEditingScript(script)
    setFormData({
      name: script.name,
      targetProfile: script.targetProfile,
      purpose: script.purpose,
      bodyMarkdown: script.bodyMarkdown,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return

    try {
      const response = await fetch(`/api/scripts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchScripts()
      } else {
        alert('削除に失敗しました')
      }
    } catch (error) {
      console.error('Failed to delete script:', error)
      alert('削除に失敗しました')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      targetProfile: '',
      purpose: '',
      bodyMarkdown: '',
    })
    setEditingScript(null)
    setShowForm(false)
  }

  if (loading) {
    return <div className="text-center py-10">読み込み中...</div>
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">スクリプト管理</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'キャンセル' : '新規作成'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingScript ? 'スクリプト編集' : '新規スクリプト作成'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">スクリプト名</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">対象顧客</label>
              <input
                type="text"
                value={formData.targetProfile}
                onChange={(e) => setFormData({ ...formData, targetProfile: e.target.value })}
                placeholder="例: 歯科医院、整骨院など"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">目的</label>
              <input
                type="text"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="例: アポ取得、商品紹介など"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">スクリプト本文（Markdown）</label>
              <textarea
                value={formData.bodyMarkdown}
                onChange={(e) => setFormData({ ...formData, bodyMarkdown: e.target.value })}
                rows={10}
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                保存
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {scripts.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            スクリプトがまだありません。新規作成してください。
          </p>
        ) : (
          scripts.map((script) => (
            <div key={script.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold">{script.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="mr-4">対象: {script.targetProfile}</span>
                    <span className="mr-4">目的: {script.purpose}</span>
                    <span>通話ログ: {script._count?.callLogs || 0}件</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(script)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(script.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
              <div className="prose max-w-none">
                <ReactMarkdown>{script.bodyMarkdown}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

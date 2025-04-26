// ────────────────────────────────────────────────────
// src/components/ThreadForm.tsx
// “use client” でクライアントレンダリングに切り替え
// Supabase の anon-JWT 付きで直接 insert を呼ぶ
// ────────────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ThreadForm() {
  const [title, setTitle] = useState('')
  const [body, setBody]   = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // supabase.auth.token が localStorage にあるので auth.uid() が効いて user_id に入る
    const { data, error } = await supabase
      .from('threads')
      .insert({ title, body })

    if (error) {
      console.error('投稿エラー:', error)
      return
    }

    // 投稿成功したらフォームをクリアして一覧をリロード
    setTitle('')
    setBody('')
    // 最も簡単な再描画方法
    window.location.reload()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        name="title"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded"
      />
      <textarea
        name="body"
        placeholder="本文"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded h-24"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        投稿する
      </button>
    </form>
  )
}

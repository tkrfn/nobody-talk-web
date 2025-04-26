// src/components/CommentForm.tsx

'use client'
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function CommentForm({ threadId }: { threadId: string }) {
  const [body, setBody] = useState('')

  // マウント時ログ
  useEffect(() => {
    console.log('CommentForm mounted, threadId:', threadId)
  }, [threadId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('handleSubmit called, body:', body)

    if (!body.trim()) {
      console.warn('コメントが空です')
      return
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({ thread_id: threadId, body })
      .select()

    console.log('Supabase insert:', { data, error })

    if (error) {
      console.error('コメント投稿エラー:', error)
    } else {
      setBody('')
      // 成功後リロード
      window.location.reload()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2 bg-gray-800 p-4 rounded">
      <textarea
        name="body"
        placeholder="コメントを入力…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full px-3 py-2 rounded bg-gray-700 text-white"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        コメントを投稿
      </button>
    </form>
  )
}

// src/components/LikeButton.tsx
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { FiThumbsUp } from 'react-icons/fi'

export default function LikeButton({ commentId }: { commentId: string }) {
  const [count, setCount] = useState(0)

  // 初期にカウントを取得
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('comment_id', commentId)
        setCount(count || 0)
      } catch (error) {
        console.error('いいね数取得エラー:', error)
      }
    }
    fetchCount()
  }, [commentId])

  const handleClick = async () => {
    console.log('👍 いいねクリック:', commentId)
    try {
      // 新規いいねを挿入して結果を取得
      const { data, error } = await supabase
        .from('likes')
        .insert({ comment_id: commentId })
        .select()
      console.log('👍 挿入結果:', data, error)
      if (error) {
        console.error('いいねエラー:', error)
        return
      }
      // 挿入後にカウントを再取得
      const { count: newCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('comment_id', commentId)
      setCount(newCount || 0)
    } catch (err) {
      console.error('いいね click エラー:', err)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center space-x-1 text-gray-400 hover:text-blue-500"
    >
      <FiThumbsUp />
      <span>{count}</span>
    </button>
  )
}

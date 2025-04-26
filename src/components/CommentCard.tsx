// src/components/CommentCard.tsx
'use client'

import { useTransition } from 'react'
import { addLike } from '@/lib/like-actions'
import { Button } from './Button'
import { Heart } from 'lucide-react'

type Comment = {
  id: string
  body: string
  created_at: string
  like_count: number
  thread_id: string
}

export function CommentCard({ comment }: { comment: Comment }) {
  const [isPending, startTransition] = useTransition()

  const handleLike = () => {
    startTransition(() => {
      addLike(comment.id, comment.thread_id)
    })
  }

  return (
    <div className="bg-surface border border-white/10 rounded-lg p-3 space-y-2">
      <p className="text-sm text-text whitespace-pre-wrap">{comment.body}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-subtext">
          {new Date(comment.created_at).toLocaleString('ja-JP')}
        </span>
        <button
          onClick={handleLike}
          disabled={isPending}
          className="flex items-center text-sm text-primary hover:opacity-80 disabled:opacity-30 space-x-1"
        >
          <Heart size={16} />
          <span>{comment.like_count}</span>
        </button>
      </div>
    </div>
  )
}

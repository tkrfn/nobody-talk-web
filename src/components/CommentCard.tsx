// src/components/CommentCard.tsx
import React from 'react'
import LikeButton from '@/components/LikeButton'

export interface Comment {
  id: string
  body: string
  created_at: string
  like_count?: number
  author_name?: string
}

interface Props {
  comment: Comment
  className?: string
  highlight?: boolean
}

export default function CommentCard({ comment, className = '', highlight }: Props) {
  const formattedDate = comment.created_at
    ? new Date(comment.created_at).toLocaleString('ja-JP', { dateStyle: 'short', timeStyle: 'short' })
    : '';

  return (
    // ▼▼▼ className に border と border-card-border を追加 ▼▼▼
    <div
      className={`bg-white rounded-2xl shadow p-4 transition hover:shadow-md border border-card-border ${ // ← ここに追加
        highlight ? 'ring-2 ring-offset-2 ring-pink-400' : ''
      } ${className}`}
    >
    {/* ▲▲▲ ここに追加 ▲▲▲ */}

      {/* コメント本文 */}
      <p className="text-sm text-gray-800 whitespace-pre-wrap break-words mb-3">
        {comment.body}
      </p>

      {/* フッター部分 */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-500">
          {formattedDate}
        </span>
        <LikeButton commentId={comment.id} initialCount={comment.like_count ?? 0} />
      </div>
    </div>
  )
}
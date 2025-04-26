import React from 'react'
import LikeButton from '@/components/LikeButton'

export interface Comment {
  id: string
  body: string
  created_at: string
  user_id: string
}

export default function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="p-3 bg-gray-700 rounded mb-2 flex justify-between items-start">
      <div className="flex-1">
        <p className="text-gray-200 whitespace-pre-wrap">{comment.body}</p>
        <div className="text-xs text-gray-400 mt-1">
          {new Date(comment.created_at).toLocaleString()}
        </div>
      </div>
      <LikeButton commentId={comment.id} />
    </div>
  )
}

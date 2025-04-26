// src/components/FAB.tsx
'use client'

import { useState } from 'react'
import { ThreadForm } from './ThreadForm'
import { CommentForm } from './CommentForm'
import { createThread } from '@/lib/actions'
import { addComment } from '@/lib/comment-actions'

type Props = {
  threadId?: string
}

export function FAB({ threadId }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="
          fixed bottom-5 right-5 z-50
          w-12 h-12 rounded-full
          bg-primary text-white text-2xl
          flex items-center justify-center
          shadow-lg hover:scale-105 transition
        "
      >
        ＋
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-card rounded-xl w-11/12 max-w-sm p-4 space-y-4">
            {threadId ? (
              <CommentForm action={addComment.bind(null, threadId)} />
            ) : (
              <ThreadForm action={createThread} />
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-3 text-sm text-subtext hover:opacity-80"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// src/components/ThreadCard.tsx

import React from 'react'

// スレッドデータの型定義
export interface Thread {
  id: string
  title: string
  body: string
}

// ThreadCard コンポーネント
export default function ThreadCard({ thread }: { thread: Thread }) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold text-white">{thread.title}</h2>
      <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">
        {thread.body}
      </p>
    </div>
  )
}

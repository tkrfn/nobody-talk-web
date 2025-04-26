// src/components/FAB.tsx
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Modal from '@/components/Modal'
import ThreadForm from '@/components/ThreadForm'
import CommentForm from '@/components/CommentForm'
import { FiPlus } from 'react-icons/fi'

export default function FAB() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const threadMatch = pathname.match(/^\/thread\/(?<id>[^/]+)/)
  const threadId = threadMatch?.groups?.id ?? null

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {threadId ? (
          // スレッド詳細ページではコメント投稿フォームを表示
          <CommentForm threadId={threadId} />
        ) : (
          // それ以外のページではスレッド投稿フォームを表示
          <ThreadForm />
        )}
      </Modal>

      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setIsOpen(true)}
      >
        <FiPlus size={24} />
      </button>
    </>
  )
}

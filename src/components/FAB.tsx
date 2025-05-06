// src/components/FAB.tsx
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation' // Next.js のフックをインポート
import { IoAdd } from 'react-icons/io5'
import CreateThreadModal from '@/components/CreateThreadModal'
import CreateCommentModal from '@/components/CreateCommentModal' // ★ 新しいコメントモーダルをインポート

export default function FAB() {
  // モーダルの開閉状態を別々に管理
  const [isCreateThreadModalOpen, setIsCreateThreadModalOpen] = useState(false)
  const [isCreateCommentModalOpen, setIsCreateCommentModalOpen] = useState(false)

  const pathname = usePathname() // 現在のページのパスを取得 (例: "/", "/thread/123")
  const isThreadPage = pathname.startsWith('/thread/') // パスが "/thread/" で始まるか判定

  // スレッド詳細ページの場合、パスからスレッドIDを取得 (もっと良い方法があればそちらで)
  const threadId = isThreadPage ? pathname.split('/')[2] : null

  const handleClick = () => {
    if (isThreadPage && threadId) {
      // スレッド詳細ページの場合、コメント作成モーダルを開く
      setIsCreateCommentModalOpen(true)
    } else {
      // それ以外のページの場合、スレッド作成モーダルを開く
      setIsCreateThreadModalOpen(true)
    }
  }

  return (
    <>
      {/* 右下固定の＋ボタン */}
      <button
        onClick={handleClick} // 条件分岐するクリックハンドラを設定
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center
                   rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition"
        // aria-label も変えると親切
        aria-label={isThreadPage ? 'コメントを作成' : 'スレッドを作成'}
      >
        <IoAdd size={28} />
      </button>

      {/* スレッド作成モーダル */}
      <CreateThreadModal
        isOpen={isCreateThreadModalOpen}
        onClose={() => setIsCreateThreadModalOpen(false)}
      />

      {/* コメント作成モーダル (スレッド詳細ページで threadId が取れた場合のみ表示) */}
      {isThreadPage && threadId && (
        <CreateCommentModal
          isOpen={isCreateCommentModalOpen}
          onClose={() => setIsCreateCommentModalOpen(false)}
          threadId={threadId} // ★ コメント対象のスレッドIDを渡す
        />
      )}
    </>
  )
}
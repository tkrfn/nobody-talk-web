// src/app/thread/[id]/page.tsx
import Link from 'next/link'
import FAB from '@/components/FAB'
import { supabase } from '@/lib/supabaseClient'
import CommentCard from '@/components/CommentCard'

interface Thread {
  id: string
  title: string
  body: string
  created_at: string
}

interface Comment {
  id: string
  body: string
  created_at: string
  user_id: string
}

export default async function ThreadPage(props: { params: { id: string } }) {
  const { id } = await props.params

  // スレッド取得
  const { data: thread } = await supabase
    .from<Thread>('threads')
    .select('*')
    .eq('id', id)
    .single()

  // コメント一覧取得
  const { data: comments } = await supabase
    .from<Comment>('comments')
    .select('*')
    .eq('thread_id', id)
    .order('created_at', { ascending: true })

  return (
    <>
      <main className="max-w-md mx-auto p-4">
        {/* 戻るリンク */}
        <Link href="/" className="text-sm text-blue-400 mb-4 inline-block">
          &larr; 一覧に戻る
        </Link>

        {/* スレッド本文 */}
        <div className="p-4 bg-gray-800 rounded-lg mb-6">
          <h1 className="text-lg font-bold text-white">{thread?.title}</h1>
          <p className="mt-2 text-gray-300 whitespace-pre-wrap">{thread?.body}</p>
        </div>

        {/* コメント一覧 */}
        <div className="space-y-2">
          {comments?.map((c) => (
            <CommentCard key={c.id} comment={c} />
          ))}
        </div>

        {/* コメント投稿は右下のFABボタンから行います */}
      </main>

      {/* 右下の + ボタン(コメント投稿フォームを開く) */}
      <FAB />
    </>
  )
}

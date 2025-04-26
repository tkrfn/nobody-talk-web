// src/app/thread/[id]/page.tsx
import Link from 'next/link'
import { supabase } from '@/supabase/supabase'
import { CommentCard } from '@/components/CommentCard'
import { FAB } from '@/components/FAB'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ThreadDetailPage({ params }: Props) {
  const { id: threadId } = await params

  // スレッド取得
  const { data: thread } = await supabase
    .from('threads')
    .select('*')
    .eq('id', threadId)
    .single()

  // コメント取得 + いいね数
  const { data: comments } = await supabase
    .from('comments')
    .select('*, likes(count)')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })

  const commentsWithLikes = (comments ?? []).map((c: any) => ({
    ...c,
    like_count: c.likes?.[0]?.count ?? 0,
    thread_id: threadId,
  }))

  if (!thread) {
    return <div className="text-center text-subtext">スレッドが見つかりません</div>
  }

  return (
    <main className="max-w-md mx-auto px-4 pt-6 pb-10 space-y-6">
      {/* 戻るリンク */}
      <div className="pb-2">
        <Link href="/" className="inline-flex items-center text-sm text-primary hover:underline">
          ← スレッド一覧に戻る
        </Link>
      </div>

      {/* スレッド本体 */}
      <section className="bg-card border border-white/10 rounded-xl p-4 space-y-2">
        <h1 className="text-xl font-bold text-text">{thread.title}</h1>
        <p className="text-base leading-relaxed text-text whitespace-pre-wrap">
          {thread.body}
        </p>
        <p className="text-xs text-subtext">
          {new Date(thread.created_at).toLocaleString('ja-JP')}
        </p>
      </section>

      {/* コメント一覧 */}
      <section className="space-y-4">
        {commentsWithLikes.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
        <div id="comment-list-end" />
      </section>

      {/* 右下の＋ボタン（コメント投稿用FAB） */}
      <FAB threadId={threadId} />
    </main>
  )
}

// サーバーアクション：コメント追加
async function addComment(threadId: string, formData: FormData) {
  'use server'
  const body = formData.get('body') as string
  if (!body) return
  const { error } = await supabase.from('comments').insert({ thread_id: threadId, body })
  if (error) console.error('コメント投稿エラー:', error.message)
  revalidatePath(`/thread/${threadId}`)
}

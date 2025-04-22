// src/app/thread/[id]/page.tsx
import { supabase } from '@/supabase/supabase'
import { CommentCard } from '@/components/CommentCard'

export const dynamic = 'force-dynamic'

type Props = {
  params: { id: string }
}

export default async function ThreadDetailPage({ params }: Props) {
  const threadId = params.id

  const { data: thread } = await supabase
    .from('threads')
    .select('*')
    .eq('id', threadId)
    .single()

  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })

  if (!thread) {
    return <div className="text-center text-subtext">スレッドが見つかりません</div>
  }

  return (
    <main className="max-w-md mx-auto px-4 pt-6 pb-10 space-y-6">
      {/* スレッド本体 */}
      <section className="bg-card border border-white/10 rounded-xl p-4 space-y-2">
        <h1 className="text-xl font-bold text-text">{thread.title}</h1>
        <p className="text-base leading-relaxed text-text whitespace-pre-wrap">{thread.body}</p>
        <p className="text-xs text-subtext">
          {new Date(thread.created_at).toLocaleString('ja-JP')}
        </p>
      </section>

      {/* コメント一覧 */}
      <section className="space-y-4">
        {comments?.length ? (
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-subtext text-sm text-center">コメントはまだありません</p>
        )}
      </section>
    </main>
  )
}

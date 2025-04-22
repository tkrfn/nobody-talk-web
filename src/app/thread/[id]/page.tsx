// src/app/thread/[id]/page.tsx
import { supabase } from '@/supabase/supabase'
import { CommentCard } from '@/components/CommentCard'
import { CommentForm } from '@/components/CommentForm'
import { revalidatePath } from 'next/cache'

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
      <section className="bg-card border border-white/10 rounded-xl p-4 space-y-2">
        <h1 className="text-xl font-bold text-text">{thread.title}</h1>
        <p className="text-base leading-relaxed text-text whitespace-pre-wrap">{thread.body}</p>
        <p className="text-xs text-subtext">
          {new Date(thread.created_at).toLocaleString('ja-JP')}
        </p>
      </section>

      <section>
        <CommentForm action={addComment.bind(null, threadId)} />
      </section>

      <section className="space-y-4">
        {comments?.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </section>
    </main>
  )
}

// ✅ Server Action（このファイル内）
async function addComment(threadId: string, formData: FormData) {
  'use server'

  const body = formData.get('body') as string
  if (!body) return

  const { error } = await supabase.from('comments').insert({
    thread_id: threadId,
    body,
  })

  if (error) {
    console.error('コメント投稿エラー:', error.message)
    return
  }

  revalidatePath(`/thread/${threadId}`)
}

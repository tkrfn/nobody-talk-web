// src/app/page.tsx
import { supabase } from '@/supabase/supabase'
import { createThread } from '@/lib/actions'
import { ThreadCard } from '@/components/ThreadCard'
import { Button } from '@/components/Button'
import Link from 'next/link'

export default async function Home() {
  const { data: threads } = await supabase
    .from('threads')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-md mx-auto px-4 pt-6 pb-10 space-y-6">
      <h1 className="text-xl font-bold text-primary">nobody-talk</h1>

      {/* 投稿フォーム */}
      <form
        action={createThread}
        className="bg-card border border-white/10 rounded-xl p-4 space-y-4"
      >
        <input
          name="title"
          placeholder="タイトルを入力"
          required
          className="w-full bg-surface border border-white/20 rounded-lg px-4 py-3 text-text placeholder-subtext text-base focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <textarea
          name="body"
          placeholder="本文を入力"
          required
          rows={4}
          className="w-full bg-surface border border-white/20 rounded-lg px-4 py-3 text-text placeholder-subtext text-base focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
        <Button type="submit">投稿する</Button>
      </form>

      {/* スレッド一覧 */}
      <ul className="space-y-4">
        {threads?.map((thread) => (
          <li key={thread.id}>
            <Link href={`/thread/${thread.id}`}>
              <ThreadCard thread={thread} />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

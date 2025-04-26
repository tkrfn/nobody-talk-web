// src/app/page.tsx
import { supabase } from '@/supabase/supabase'
import { ThreadCard } from '@/components/ThreadCard'
import { FAB } from '@/components/FAB'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: threads } = await supabase
    .from('threads')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-md mx-auto px-4 pt-6 pb-10 space-y-6">
      <h1 className="text-xl font-bold text-text">新着スレッド</h1>
      <ul className="space-y-4">
        {threads?.map((thread) => (
          <li key={thread.id}>
            <ThreadCard thread={thread} />
          </li>
        ))}
      </ul>

      {/* 右下の＋ボタン（FAB） */}
      <FAB />
    </main>
  )
}

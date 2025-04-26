// src/app/page.tsx
import React from 'react'
import Link from 'next/link'
import ThreadCard from '@/components/ThreadCard'
import FAB from '@/components/FAB'
import { supabase } from '@/lib/supabaseClient'

// スレッド一覧を取得する関数
async function getThreads() {
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('スレッド取得エラー:', error)
    return []
  }
  return data
}

export default async function Home() {
  const threads = await getThreads()

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">新着スレッド</h1>
      <div className="space-y-3">
        {threads.map((thread) => (
          <Link 
            key={thread.id} 
            href={`/thread/${thread.id}`} 
            className="block"
          >
            <ThreadCard thread={thread} />
          </Link>
        ))}
      </div>

      {/* 右下の + ボタン */}
      <FAB />
    </main>
  )
}

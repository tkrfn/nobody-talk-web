// src/app/threads/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ThreadCard from '@/components/ThreadCard'
import FAB from '@/components/FAB'
import { getThreadsSorted } from '@/lib/thread-service'

export default function ThreadsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') ?? 'new'
  const [threads, setThreads] = useState<any[]>([])

  // sort が変わるたびにスレッドを再取得
  useEffect(() => {
    ;(async () => {
      const data = await getThreadsSorted(sort)
      setThreads(data)
    })()
  }, [sort])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/threads?sort=${e.target.value}`)
  }

  return (
    <main className="flex-1">
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* ソートトグル */}
        <div className="flex justify-end items-center space-x-2">
          <span className="text-sm text-gray-600">現在の並び:</span>
          <select
            value={sort}
            onChange={handleChange}
            className="bg-gray-800 text-white border border-gray-600 p-1 rounded text-sm"
          >
            <option value="new">新着</option>
            <option value="24h">24h人気</option>
            <option value="week">週間人気</option>
            <option value="month">月間人気</option>
            <option value="all">全期間人気</option>
          </select>
        </div>

        {/* スレッド一覧 */}
        <div className="space-y-3">
          {threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      </div>

      {/* FAB */}
      <FAB />
    </main>
  )
}

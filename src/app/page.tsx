// src/app/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import ThreadCard from '@/components/ThreadCard'
import { getThreadsSorted } from '@/lib/thread-service'

type Sort = 'new' | '24h' | 'week' | 'month' | 'all' | 'random'
const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: 'new',    label: '新着'     },
  { value: '24h',    label: '24h人気' },
  { value: 'week',   label: '週間人気' },
  { value: 'month',  label: '月間人気' },
  { value: 'all',    label: '全期間人気' },
  { value: 'random', label: 'ランダム' },
]

const PAGE_SIZE = 20

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // 現在のソート＆ページを URL から取得
  const currentSort = (searchParams.get('sort') as Sort) || '24h'
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const [sort, setSort] = useState<Sort>(currentSort)
  const [page, setPage] = useState(currentPage)
  const [allThreads, setAllThreads] = useState<any[]>([])
  const [paged, setPaged] = useState<any[]>([])

  // URL が変わったら state に反映
  useEffect(() => { setSort(currentSort) }, [currentSort])
  useEffect(() => { setPage(currentPage) }, [currentPage])

  // sort が変わるたびに全スレッドを取得
  useEffect(() => {
    ;(async () => {
      const data = await getThreadsSorted(sort)
      setAllThreads(data)
      // sort 変更時はページ１に遷移
      router.push(`/?sort=${sort}&page=1`)
    })()
  }, [sort])

  // allThreads or page が変わったら、該当ページ分を切り出し
  useEffect(() => {
    const start = (page - 1) * PAGE_SIZE
    setPaged(allThreads.slice(start, start + PAGE_SIZE))
  }, [allThreads, page])

  // ページ遷移共通
  const navigate = (newSort: Sort, newPage: number) => {
    router.push(`/?sort=${newSort}&page=${newPage}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <main className="flex-1 w-[90%] max-w-md mx-auto p-4 space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <p className="text-center text-xl font-semibold text-gray-900">
            誰にも言えないからこそ、ここで吐き出して楽になりましょう。
          </p>
          <p className="text-center text-sm text-gray-700">
            注意: 投稿に対する誹謗中傷は厳禁です。{' '}
            <Link href="/rules" className="underline text-gray-700">
              利用規約はこちら
            </Link>
          </p>
          <div className="overflow-x-auto py-2 -mx-6 px-6">
            <div className="flex items-center space-x-4">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => navigate(opt.value, 1)}
                  className={`flex-shrink-0 py-1 px-4 rounded-full font-medium whitespace-nowrap ${
                    sort === opt.value
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {paged.map(thread => (
            <Link key={thread.id} href={`/thread/${thread.id}`}>
              <ThreadCard thread={thread} />
            </Link>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => navigate(sort, page - 1)}
            disabled={page <= 1}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
          >
            前へ
          </button>
          <button
            onClick={() => navigate(sort, page + 1)}
            disabled={page * PAGE_SIZE >= allThreads.length}
            className="bg-gray-900 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            次へ
          </button>
        </div>
      </main>
    </div>
  )
}

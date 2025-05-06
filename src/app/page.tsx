// src/app/page.tsx (修正版 - ページネーション統合)
export const dynamic = 'force-dynamic'

import Link from 'next/link' // ★ Link コンポーネントをインポート
import { supabase } from '@/lib/supabaseClient'
import SortTabs from '@/components/SortTabs'
import ThreadCard from '@/components/ThreadCard'
import FAB from '@/components/FAB'
import { getThreadsSorted } from '@/lib/thread-service'

interface PageProps {
  searchParams: Promise<{ sort?: string; page?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const { sort = 'new', page = '1' } = await searchParams
  const sortKey = sort
  const pageNum = parseInt(page, 10) || 1 // page が不正な値の場合 1 にフォールバック
  const limit = 20
  const from = (pageNum - 1) * limit
  const to = from + limit - 1

  // スレッド取得
  let allThreads: any[]
  if (sortKey === 'random') {
    const { data } = await supabase.from('threads').select('*')
    allThreads = (data || []).sort(() => Math.random() - 0.5)
  } else {
    allThreads = await getThreadsSorted(sortKey) // ★ image_url も取得できているか確認が必要
  }

  // ページネーション用データ
  const threads = allThreads.slice(from, to + 1)

  // ページネーションの状態を計算
  const hasPreviousPage = pageNum > 1
  const hasNextPage = allThreads.length > to

  // ボタンのスタイルクラス定義
  const baseButtonClasses = "inline-block px-4 py-2 rounded text-white transition duration-150 ease-in-out text-sm font-medium shadow";
  const activeButtonClasses = "bg-pink-500 hover:bg-pink-600"; // FABと同じピンク
  const disabledButtonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed shadow-inner";

  // ソートタブ用オプション
  const options = [
    { key: 'new', label: '新着' },
    { key: '24h', label: '24H人気' },
    { key: 'week', label: '週間人気' },
    { key: 'month', label: '月間人気' },
    { key: 'all', label: '全期間人気' },
    { key: 'random', label: 'ランダム' },
  ]

  return (
    <div className="space-y-4 pb-24"> {/* FABのためにpadding-bottomを追加 */}
      {/* ▼▼▼ SortTabs に activeSortKey を渡す ▼▼▼ */}
      <SortTabs options={options} activeSortKey={sortKey} />
      {/* ▲▲▲ SortTabs に activeSortKey を渡す ▲▲▲ */}

      {/* スレッド一覧 */}
      <div className="space-y-3">
        {threads.map((thread) => (
          // ThreadCard は画像表示対応済みのものを使用
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </div>

      {/* ▼▼▼ ページネーションコントロール (以前のコードを置き換え) ▼▼▼ */}
      {(hasPreviousPage || hasNextPage) && (
        <div className="flex items-center justify-center space-x-4 my-6">
          {/* 戻るボタン */}
          {hasPreviousPage ? (
            <Link
              href={`/?sort=${sortKey}&page=${pageNum - 1}`}
              className={`${baseButtonClasses} ${activeButtonClasses}`}
            >
              ← 戻る
            </Link>
          ) : (
            <span className={`${baseButtonClasses} ${disabledButtonClasses}`}>
              ← 戻る
            </span>
          )}

          {/* 現在のページ番号表示 */}
          <span className="text-gray-600 text-sm font-medium">
            {pageNum} ページ
          </span>

          {/* 次へボタン */}
          {hasNextPage ? (
            <Link
              href={`/?sort=${sortKey}&page=${pageNum + 1}`}
              className={`${baseButtonClasses} ${activeButtonClasses}`}
            >
              次へ →
            </Link>
          ) : (
            <span className={`${baseButtonClasses} ${disabledButtonClasses}`}>
              次へ →
            </span>
          )}
        </div>
      )}
      {/* ▲▲▲ ページネーションコントロール ▲▲▲ */}

      {/* FAB */}
      <FAB />
    </div>
  )
}
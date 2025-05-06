// src/app/thread/[id]/page.tsx (修正版 - activeSortKey を渡す)
export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import ThreadCard from '@/components/ThreadCard'
import CommentCard from '@/components/CommentCard'
// import CommentForm from '@/components/CommentForm' // CommentForm は削除済みのはず
import SortTabs from '@/components/SortTabs'
import FAB from '@/components/FAB'
import { getThreadById } from '@/lib/thread-service'
import { supabase } from '@/lib/supabaseClient'
import React from 'react'; // ← これを追加

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ sort?: string }>
}

export default async function ThreadPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params
  if (!id) redirect('/')

  const thread = await getThreadById(id)

  // URLからソートキーを取得 (なければ 'new')
  const { sort } = await searchParams
  const sortKey = sort ?? 'new' // ★ この sortKey を SortTabs に渡す
  const ascending = sortKey === 'old'

  // コメントデータを取得
  const { data: comments = [] } = await supabase
    .from('comments')
    .select('*')
    .eq('thread_id', id)
    .order('created_at', { ascending })
    .limit(100)

  // likeThreshold を計算
  const sortedLikes = [...comments].sort((a, b) => b.like_count - a.like_count)
  const thresholdIdx = Math.ceil(sortedLikes.length * 0.25) - 1
  const likeThreshold =
    thresholdIdx >= 0 && sortedLikes[thresholdIdx] ? sortedLikes[thresholdIdx].like_count : 0

  // コメント用ソートオプション
  const commentSortOptions = [
    { key: 'new', label: '新着順' },
    { key: 'old', label: '古い順' },
  ]

  return (
    <div className="space-y-6 pb-24">
      {/* ▼▼▼ ここで activeSortKey={sortKey} を渡す ▼▼▼ */}
      <SortTabs options={commentSortOptions} activeSortKey={sortKey} />
      {/* ▲▲▲ ここで activeSortKey={sortKey} を渡す ▲▲▲ */}

      {/* スレッドカード */}
      {thread && <ThreadCard thread={thread} isDetailPage={true} />} {/* ★ isDetailPage={true} を追加 */}

      {/* コメント一覧 */}
      <div className="space-y-4">
        {comments.map((c: any) => (
          <CommentCard
            key={c.id}
            comment={c}
            highlight={c.like_count >= likeThreshold && likeThreshold > 0}
          />
        ))}
      </div>

      {/* FAB */}
      <FAB />
    </div>
  )
}
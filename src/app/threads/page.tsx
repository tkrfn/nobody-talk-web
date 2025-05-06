// src/app/thread/[id]/page.tsx
export const dynamic = 'force-dynamic'

import ThreadCard from '@/components/ThreadCard'
import CommentCard from '@/components/CommentCard'
import SortTabs from '@/components/SortTabs'
import FAB from '@/components/FAB'
import { getThreadById } from '@/lib/thread-service'
import { supabase } from '@/lib/supabaseClient'
import React from 'react'; // ← これを追加

interface PageProps {
  params: { id: string }
  searchParams: { sort?: string }
}

export default async function ThreadPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = params
  const thread = await getThreadById(id)

  const sortKey = searchParams.sort ?? 'new'
  const ascending = sortKey === 'old'

  const { data: comments = [] } = await supabase
    .from('comments')
    .select('*')
    .eq('thread_id', id)
    .order('created_at', { ascending })
    .limit(100)

  const sortedLikes = [...comments].sort((a, b) => b.like_count - a.like_count)
  const thresholdIdx = Math.ceil(sortedLikes.length * 0.25) - 1
  const likeThreshold =
    thresholdIdx >= 0 ? sortedLikes[thresholdIdx].like_count : Infinity

  const commentSortOptions = [
    { key: 'new', label: '新着順' },
    { key: 'old', label: '古い順' },
  ]

  return (
    <div className="space-y-6">
      <SortTabs options={commentSortOptions} />
      {thread && <ThreadCard thread={thread} />}
      <div className="space-y-4">
        {comments.map((c: any) => (
          <CommentCard
            key={c.id}
            comment={c}
            highlight={c.like_count >= likeThreshold}
          />
        ))}
      </div>
      <FAB />
    </div>
  )
}

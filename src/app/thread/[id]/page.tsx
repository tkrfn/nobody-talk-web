// src/app/thread/[id]/page.tsx (selectの型指定修正版)
export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { getThreadById } from '@/lib/thread-service'
import { Thread, Comment } from '@/types' // Comment 型をインポートしていることを確認
import ThreadCard from '@/components/ThreadCard'
import CommentCard from '@/components/CommentCard'
import SortTabs from '@/components/SortTabs'
import FAB from '@/components/FAB'

interface PageProps {
  params: { id: string };
  searchParams: { sort?: string };
}

export default async function ThreadPage({ params, searchParams }: PageProps) {
  const { id } = params;
  if (!id) redirect('/');

  const thread: Thread | null = await getThreadById(id);

  const sortKey = searchParams.sort ?? 'new';
  const ascending = sortKey === 'old';

  let comments: Comment[] = [];
  // ▼▼▼ selectのジェネリック型指定を削除 ▼▼▼
  const { data, error: commentError } = await supabase
    .from('comments')
    .select('*') // ★ ジェネリック型指定 <Comment> を削除
    .eq('thread_id', id)
    .order('created_at', { ascending })
    .limit(100);

  if (commentError) {
    console.error("コメントの取得エラー:", commentError);
  } else {
    // ★ data に対して型アサーションを行う
    comments = (data as Comment[] | null) || [];
  }

  const sortedLikes = [...comments].sort((a, b) => (b.like_count ?? 0) - (a.like_count ?? 0));
  const thresholdIdx = Math.ceil(sortedLikes.length * 0.25) - 1;
  const likeThreshold =
    thresholdIdx >= 0 && sortedLikes[thresholdIdx] ? (sortedLikes[thresholdIdx].like_count ?? 0) : 0;

  const commentSortOptions = [
    { key: 'new', label: '新着順' },
    { key: 'old', label: '古い順' },
  ];

  return (
    <div className="space-y-6 pb-24">
      <SortTabs options={commentSortOptions} activeSortKey={sortKey} />

      {thread && <ThreadCard thread={thread} isDetailPage={true} />}

      <div className="space-y-4">
        {comments.map((c) => (
          <CommentCard
            key={c.id}
            comment={c}
            highlight={ (c.like_count ?? 0) >= likeThreshold && likeThreshold > 0}
          />
        ))}
      </div>
      <FAB />
    </div>
  );
}
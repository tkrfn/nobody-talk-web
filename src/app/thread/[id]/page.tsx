// src/app/thread/[id]/page.tsx (修正版 - 型定義適用)
export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { getThreadById } from '@/lib/thread-service' // getThreadById が Promise<Thread | null> を返すと仮定
import { Thread, Comment } from '@/types' // ★ 型定義をインポート
import ThreadCard from '@/components/ThreadCard'
import CommentCard from '@/components/CommentCard'
import SortTabs from '@/components/SortTabs'
import FAB from '@/components/FAB'
// import React from 'react'; // 通常ページコンポーネントでは不要

// PageProps の型定義 (Promise を削除)
interface PageProps {
  params: { id: string };
  searchParams: { sort?: string };
}

export default async function ThreadPage({ params, searchParams }: PageProps) {
  // params, searchParams は直接アクセス可能 (await不要)
  const { id } = params;
  if (!id) redirect('/');

  // thread の型注釈を追加 (getThreadById の戻り値に依存)
  const thread: Thread | null = await getThreadById(id);

  const sortKey = searchParams.sort ?? 'new';
  const ascending = sortKey === 'old';

  // comments の型注釈を追加
  let comments: Comment[] = [];
  const { data, error: commentError } = await supabase
    .from('comments')
    .select<Comment>('*') // ★ ジェネリック型を Comment に変更 (配列ではなく単一の型)
    .eq('thread_id', id)
    .order('created_at', { ascending })
    .limit(100);

  if (commentError) {
    console.error("コメントの取得エラー:", commentError);
    // ここでエラーページを表示するなどの処理も可能
  } else {
    comments = data || []; // data が null の場合は空配列に
  }

  // likeThreshold の計算 (Null合体演算子 ?? を使って安全に)
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
      {/* activeSortKey を渡す */}
      <SortTabs options={commentSortOptions} activeSortKey={sortKey} />

      {/* スレッドカード (thread が null でないか確認) */}
      {thread && <ThreadCard thread={thread} isDetailPage={true} />}

      {/* コメント一覧 */}
      <div className="space-y-4">
        {/* ★ c の :any 型指定を削除 (TypeScriptが Comment 型と推論) */}
        {comments.map((c) => (
          <CommentCard
            key={c.id}
            comment={c} // c は Comment 型
            // ★ highlight 計算でも ?? を使用
            highlight={ (c.like_count ?? 0) >= likeThreshold && likeThreshold > 0}
          />
        ))}
      </div>

      {/* FAB */}
      <FAB />
    </div>
  );
}
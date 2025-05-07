// src/app/page.tsx (no-unused-vars 'params' 修正版)
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import SortTabs from '@/components/SortTabs';
import ThreadCard from '@/components/ThreadCard';
import type { ThreadCardProps } from '@/components/ThreadCard';
import FAB from '@/components/FAB';

// ★ PageProps の型定義を修正 (params を削除またはオプショナルに)
interface PageProps {
  // params: { [key: string]: string | string[] | undefined }; // params が不要な場合はこの行を削除
  searchParams?: { [key: string]: string | string[] | undefined };
}

async function fetchThreadsWithComments(
  page = 1,
  sortKey = 'new',
  limit = 20
): Promise<ThreadCardProps['thread'][]> {
  const offset = (page - 1) * limit;
  let rpcSortColumn = 'created_at';
  let rpcIsAscending = false;

  switch (sortKey) {
    case 'new':
      rpcSortColumn = 'created_at';
      rpcIsAscending = false;
      break;
    case 'comment_count_desc':
      rpcSortColumn = 'comment_count';
      rpcIsAscending = false;
      break;
    default:
      rpcSortColumn = 'created_at';
      rpcIsAscending = false;
      break;
  }

  if (sortKey === 'random') {
    const { data, error } = await supabase.rpc('get_threads_with_comment_count', {
      order_by_column: 'created_at',
      is_ascending: false,
      page_limit: 100,
      page_offset: 0,
    });
    if (error) {
      console.error('Error fetching threads for random sort:', error.message);
      return [];
    }
    return (data || []).sort(() => Math.random() - 0.5).slice(0, limit);
  }

  const { data, error } = await supabase.rpc('get_threads_with_comment_count', {
    order_by_column: rpcSortColumn,
    is_ascending: rpcIsAscending,
    page_limit: limit,
    page_offset: offset,
  });

  if (error) {
    console.error('Error fetching threads with comment count:', error.message);
    return [];
  }
  return data || [];
}

// ★ Home コンポーネントの引数から params を削除
export default async function Home({ searchParams }: PageProps) {
  const sortParam = searchParams?.sort;
  const sortKey = Array.isArray(sortParam) ? sortParam[0] ?? 'new' : sortParam ?? 'new';

  const pageParam = searchParams?.page;
  const page = Array.isArray(pageParam) ? pageParam[0] ?? '1' : pageParam ?? '1';

  const pageNum = parseInt(page, 10) || 1;
  const limit = 20;

  const threadsToDisplay = await fetchThreadsWithComments(pageNum, sortKey, limit);

  const hasPreviousPage = pageNum > 1;
  const hasNextPage = threadsToDisplay.length === limit;

  const baseButtonClasses = "inline-block px-4 py-2 rounded text-white transition duration-150 ease-in-out text-sm font-medium shadow";
  const activeButtonClasses = "bg-pink-500 hover:bg-pink-600";
  const disabledButtonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed shadow-inner";

  const options = [
    { key: 'new', label: '新着' },
    { key: 'comment_count_desc', label: 'コメント多'},
    { key: 'random', label: 'ランダム' },
  ];

  return (
    <div className="space-y-4 pb-24">
      <SortTabs options={options} activeSortKey={sortKey} />

      <div className="space-y-3">
        {threadsToDisplay.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
        {threadsToDisplay.length === 0 && (
            <p className="text-center text-slate-400 py-10">該当するスレッドはありません。</p>
        )}
      </div>

      {(hasPreviousPage || hasNextPage) && (
        <div className="flex items-center justify-center space-x-4 my-6">
          {hasPreviousPage ? (
            <Link href={`/?sort=${sortKey}&page=${pageNum - 1}`} className={`${baseButtonClasses} ${activeButtonClasses}`}>
              ← 戻る
            </Link>
          ) : (
            <span className={`${baseButtonClasses} ${disabledButtonClasses}`}> ← 戻る </span>
          )}
          <span className="text-slate-400 text-sm font-medium"> {pageNum} ページ </span>
          {hasNextPage ? (
            <Link href={`/?sort=${sortKey}&page=${pageNum + 1}`} className={`${baseButtonClasses} ${activeButtonClasses}`}>
              次へ →
            </Link>
          ) : (
            <span className={`${baseButtonClasses} ${disabledButtonClasses}`}> 次へ → </span>
          )}
        </div>
      )}
      <FAB />
    </div>
  );
}
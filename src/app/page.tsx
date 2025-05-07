// src/app/page.tsx (コメント数取得対応版)
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
// import { getThreadsSorted } from '@/lib/thread-service'; // ← RPCを使うので、これは不要になるかもしれません
import { Thread } from '@/types'; // 型定義は引き続き使用
import SortTabs from '@/components/SortTabs';
import ThreadCard from '@/components/ThreadCard';
import type { ThreadCardProps } from '@/components/ThreadCard'; // ★ ThreadCardProps をインポート
import FAB from '@/components/FAB';

interface PageProps {
  searchParams: { sort?: string; page?: string };
}

// ★ RPC呼び出し用の関数を定義 (前回の提案と同様)
async function fetchThreadsWithComments(
  page = 1,
  sortKey = 'new', // 'new', '24h', 'week', 'month', 'all', 'random' など
  limit = 20
): Promise<ThreadCardProps['thread'][]> { // ★ RPCの戻り値の型に合わせる
  const offset = (page - 1) * limit;

  let rpcSortColumn = 'created_at';
  let rpcIsAscending = false;

  // sortKey に応じてRPCのソートパラメータを設定
  switch (sortKey) {
    case 'new':
      rpcSortColumn = 'created_at';
      rpcIsAscending = false;
      break;
    case 'comment_count_desc': // 例: コメント数が多い順のソートキー (必要に応じて追加)
      rpcSortColumn = 'comment_count';
      rpcIsAscending = false;
      break;
    // 他のソートキー (24h, week, month, all) に応じたロジックをここに追加
    // 人気順はいいね数やビュー数など、別の基準かもしれませんので、
    // get_popular_threads のような別のRPCやロジックと組み合わせる必要があるかもしれません。
    // ここでは一旦 created_at と comment_count の例のみ示します。
    // 'random' の場合はRPC側で対応するか、取得後にシャッフルします。
    // 今回のRPCは 'random' ソートを直接サポートしていません。
    default:
      rpcSortColumn = 'created_at';
      rpcIsAscending = false;
      break;
  }

  // 'random' ソートの場合は、一旦created_atで取得してからシャッフルするか、
  // RPC自体をランダムソート対応にする必要があります。
  // ここでは、'random' の場合はRPC呼び出し後にフロントでシャッフルする例を示します。
  if (sortKey === 'random') {
    // 全件取得に近い形で取得してからシャッフル (ページネーションは別途考慮が必要)
    // もしくは、ある程度の件数を取得してシャッフル
    // ここでは一旦、RPCで取得できる範囲で通常通り取得し、その結果をシャッフルします。
    // (注: このランダム処理はページネーションと組み合わせる場合、工夫が必要です)
    const { data, error } = await supabase.rpc('get_threads_with_comment_count', {
      order_by_column: 'created_at', // ランダムなので基準は何でもよいが、一貫性のため
      is_ascending: false,
      page_limit: 100, // ランダム表示のため、ある程度多めに取得 (調整が必要)
      page_offset: 0,  // ランダムなのでオフセットは0固定で良いかも
    });
    if (error) {
      console.error('Error fetching threads for random sort:', error.message);
      return [];
    }
    return (data || []).sort(() => Math.random() - 0.5).slice(0, limit); // 取得後シャッフルして件数制限
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


export default async function Home({ searchParams }: PageProps) {
  const sortKey = searchParams.sort ?? 'new';
  const page = searchParams.page ?? '1';
  const pageNum = parseInt(page, 10) || 1;
  const limit = 20;

  // ★ 新しいRPC関数を使ってスレッドデータを取得
  const allThreadsFetched = await fetchThreadsWithComments(pageNum, sortKey, limit);

  // ★ RPC側でページネーションしているので、sliceは基本的に不要になります。
  // ただし、RPCが全件返し、フロントでページネーションする場合はsliceが必要です。
  // 今回のRPCはページネーション対応なので、sliceは不要。
  const threadsToDisplay = allThreadsFetched; // RPCが返したものがそのまま表示対象

  // ページネーション状態の計算 (全件数をどう取得するかが課題)
  // RPCで全件数を返すようにするか、別途カウント用のRPCが必要になります。
  // ここでは簡易的に、取得した件数がlimit未満なら最終ページとみなします。
  const hasPreviousPage = pageNum > 1;
  const hasNextPage = threadsToDisplay.length === limit; // 取得件数がlimitと同じなら次ページがある可能性

  const baseButtonClasses = "inline-block px-4 py-2 rounded text-white transition duration-150 ease-in-out text-sm font-medium shadow";
  const activeButtonClasses = "bg-pink-500 hover:bg-pink-600";
  const disabledButtonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed shadow-inner";

  const options = [
    { key: 'new', label: '新着' },
    // { key: '24h', label: '24H人気' }, // 人気系のソートは別途定義が必要
    // { key: 'week', label: '週間人気' },
    // { key: 'month', label: '月間人気' },
    // { key: 'all', label: '全期間人気' },
    { key: 'comment_count_desc', label: 'コメント多'}, // コメント数順の例
    { key: 'random', label: 'ランダム' },
  ];

  return (
    <div className="space-y-4 pb-24">
      <SortTabs options={options} activeSortKey={sortKey} />

      <div className="space-y-3">
        {threadsToDisplay.map((thread) => (
          // ★ thread の型は ThreadCardProps['thread'] になっているはず
          <ThreadCard key={thread.id} thread={thread} />
        ))}
        {threadsToDisplay.length === 0 && (
            <p className="text-center text-gray-500 py-10">該当するスレッドはありません。</p>
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
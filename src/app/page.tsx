// src/app/page.tsx (修正版 - 型定義適用・ページネーション統合)
export const dynamic = 'force-dynamic';

import Link from 'next/link'; // ★ Link をインポート
import { supabase } from '@/lib/supabaseClient';
import { getThreadsSorted } from '@/lib/thread-service'; // getThreadsSorted が Promise<Thread[]> を返すと仮定
import { Thread } from '@/types'; // ★ 型定義をインポート
import SortTabs from '@/components/SortTabs';
import ThreadCard from '@/components/ThreadCard';
import FAB from '@/components/FAB';

// PageProps 型修正 (Promise 削除)
interface PageProps {
  searchParams: { sort?: string; page?: string };
}

export default async function Home({ searchParams }: PageProps) {
  // await を削除
  const sortKey = searchParams.sort ?? 'new';
  const page = searchParams.page ?? '1';
  // 不正なページ番号に対応するため || 1 を追加
  const pageNum = parseInt(page, 10) || 1;
  const limit = 20; // 1ページあたりの表示件数
  const from = (pageNum - 1) * limit;
  const to = from + limit - 1;

  // スレッド取得 + 型付け
  let allThreads: Thread[] = []; // ★ any[] から Thread[] に変更
  try { // エラーハンドリング追加推奨
    if (sortKey === 'random') {
      // ★ select<Thread[]> で型を指定
      const { data, error } = await supabase.from('threads').select<Thread[]>('*');
      if (error) throw error; // エラーがあればスロー
      allThreads = (data || []).sort(() => Math.random() - 0.5);
    } else {
      // getThreadsSorted が Thread[] を返すと仮定
      allThreads = await getThreadsSorted(sortKey);
    }
  } catch (error) {
      console.error("スレッドの取得エラー:", error);
      // ここでエラーメッセージを表示するなどの処理も可能
      allThreads = []; // エラー時は空にする
  }


  // ページネーション用データ (型は Thread[])
  const threads = allThreads.slice(from, to + 1);

  // ページネーション状態を計算
  const hasPreviousPage = pageNum > 1;
  const hasNextPage = allThreads.length > to + 1; // ★ to ではなく to + 1 より大きいかで判定

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
  ];

  return (
    // ★ pb-24 を追加してFABとの重なりを回避
    <div className="space-y-4 pb-24">
      {/* ★ SortTabs に activeSortKey を渡す */}
      <SortTabs options={options} activeSortKey={sortKey} />

      {/* スレッド一覧 */}
      <div className="space-y-3">
        {/* ★ map 内の thread は Thread 型と推論される (型注釈不要) */}
        {threads.map((thread) => (
          // isDetailPage は指定しない (デフォルトで false)
          <ThreadCard key={thread.id} thread={thread} />
        ))}
        {/* スレッドがない場合の表示 (任意) */}
        {threads.length === 0 && (
            <p className="text-center text-gray-500 py-10">該当するスレッドはありません。</p>
        )}
      </div>

      {/* ▼▼▼ ページネーションコントロール (統合済み) ▼▼▼ */}
      {(hasPreviousPage || hasNextPage) && (
        <div className="flex items-center justify-center space-x-4 my-6">
          {/* 戻るボタン */}
          {hasPreviousPage ? (
            <Link href={`/?sort=${sortKey}&page=${pageNum - 1}`} className={`${baseButtonClasses} ${activeButtonClasses}`}>
              ← 戻る
            </Link>
          ) : (
            <span className={`${baseButtonClasses} ${disabledButtonClasses}`}> ← 戻る </span>
          )}
          {/* ページ番号 */}
          <span className="text-gray-600 text-sm font-medium"> {pageNum} ページ </span>
          {/* 次へボタン */}
          {hasNextPage ? (
            <Link href={`/?sort=${sortKey}&page=${pageNum + 1}`} className={`${baseButtonClasses} ${activeButtonClasses}`}>
              次へ →
            </Link>
          ) : (
            <span className={`${baseButtonClasses} ${disabledButtonClasses}`}> 次へ → </span>
          )}
        </div>
      )}
      {/* ▲▲▲ ページネーションコントロール ▲▲▲ */}

      {/* FAB */}
      <FAB />
    </div>
  );
}
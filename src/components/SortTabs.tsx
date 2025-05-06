// src/components/SortTabs.tsx (修正版)
'use client';

import React from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

interface SortOption {
  key: string;
  label: string;
}

// ★ Propsに activeSortKey を追加
interface SortTabsProps {
  options: SortOption[];
  activeSortKey: string; // 親コンポーネントから渡される現在アクティブなキー
}

// ★ propsで activeSortKey を受け取る
export default function SortTabs({ options, activeSortKey }: SortTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  // ▼ コンポーネント内部で currentSort を取得する代わりに props を使う
  // const currentSort = searchParams.get('sort') || 'new';

  const handleClick = (key: string) => {
    // ★ すでに選択中のボタンはクリックしても何もしない
    if (key === activeSortKey) {
      return;
    }
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('sort', key);
    // ソート順を変えたらページ番号をリセットする (任意)
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    // ▼▼▼ 外側の div に flex justify-center を追加して中央揃え ▼▼▼
    // 不要なクラスを削除し、見た目を調整 (背景色、角丸、影、マージン追加)
    <div className="flex justify-center space-x-2 sm:space-x-4 overflow-x-auto bg-white py-2 mb-4 rounded-lg shadow-sm">
    {/* ▲▲▲ 中央揃えとスタイル調整 ▲▲▲ */}
      {options.map((option) => {
        // ★ activeSortKey (props) と比較してアクティブ状態を判定
        const isActive = option.key === activeSortKey;

        return (
          <button
            key={option.key}
            onClick={() => handleClick(option.key)}
            // ▼▼▼ className を isActive に基づいて変更 ▼▼▼
            className={`inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition border whitespace-nowrap ${ // 基本スタイル(枠線追加)
              isActive
                ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-default pointer-events-none' // ★ 選択中 (グレーアウト)
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800'    // ★ 非選択中
            }`}
            // ▲▲▲ className 変更 ▲▲▲
            disabled={isActive} // ★ アクティブなボタンは無効化
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
// src/components/SortTabs.tsx (修正版 - justify-center 削除)
'use client';

import React from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

interface SortOption {
  key: string;
  label: string;
}

interface SortTabsProps {
  options: SortOption[];
  activeSortKey: string;
}

export default function SortTabs({ options, activeSortKey }: SortTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (key: string) => {
    if (key === activeSortKey) return;
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('sort', key);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    // 外側の div: overflow と 基本スタイル
    <div className="overflow-x-auto bg-white py-2 mb-4 rounded-lg shadow-sm">
      {/* ▼▼▼ 内側の div: justify-center を削除 ▼▼▼ */}
      <div className="flex space-x-2 sm:space-x-4 px-4"> {/* ★ justify-center を削除 */}
      {/* ▲▲▲ justify-center を削除 ▲▲▲ */}
        {options.map((option) => {
          const isActive = option.key === activeSortKey;
          return (
            <button
              key={option.key}
              onClick={() => handleClick(option.key)}
              className={`inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition border whitespace-nowrap ${
                isActive
                  ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-default pointer-events-none'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800'
              }`}
              disabled={isActive}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
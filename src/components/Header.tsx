// src/components/Header.tsx (修正版)
'use client'

import Link from 'next/link'

export default function Header() {
  return (
    // ▼▼▼ header の className を変更 (背景色、パディング調整) ▼▼▼
    <header className="w-full bg-custom-header-footer shadow text-white p-4">
    {/* ▲▲▲ header の className を変更 ▲▲▲ */}
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* クリックでトップへ (文字色変更) */}
        <Link href="/" className="text-2xl font-bold text-white"> {/* ← text-white 追加 */}
          Nobody Talk
        </Link>
        {/* 利用規約へのリンク (文字色変更) */}

      </div>
      {/* ▼▼▼ タグライン修正・リンク追加・スタイル調整 ▼▼▼ */}

      {/* ▲▲▲ タグライン修正・リンク追加・スタイル調整 ▲▲▲ */}
    </header>
  )
}
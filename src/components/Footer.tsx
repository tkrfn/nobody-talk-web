// src/components/Footer.tsx (修正版 - 縦並び)
'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-custom-header-footer shadow-inner py-4 mt-6">
      {/* ▼▼▼ この div のクラス名を変更 ▼▼▼ */}
      {/* flex-col で縦積み、items-center で中央揃え、space-y-1 で各行間のスペースを設定 */}
      <div className="max-w-md mx-auto flex flex-col items-center space-y-1 text-xs text-white opacity-80">
      {/* ▲▲▲ クラス名を変更 ▲▲▲ */}
        <Link href="/terms" className="hover:underline">
          利用規約
        </Link>
        <Link href="/contact" className="hover:underline">
          お問い合わせ
        </Link>
        <Link href="/privacy" className="hover:underline">
           プライバシーポリシー
        </Link>
        {/* コピーライト表記 */}
        <span className="mt-5"> {/* ← 上のリンクとの間隔を少しだけ空ける */}
          © {new Date().getFullYear()} Nobody Talk. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
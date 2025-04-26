'use client'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link href="/" className="hover:underline">Nobody Talk</Link>
      </h1>
      {/* トグルは一覧ページ側に移動しました */}
    </header>
  )
}

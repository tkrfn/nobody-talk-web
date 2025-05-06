// src/app/layout.tsx (修正版 - Tagline追加)
import './globals.css'
import SupabaseProvider from '@/lib/SupabaseProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Tagline from '@/components/Tagline' // ★ Tagline コンポーネントをインポート

export const metadata = {
  title: 'Nobody Talk',
  description: '匿名掲示板「Nobody Talk」',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen font-sans bg-background-cream text-gray-800">
        <SupabaseProvider>
          <Header />
          {/* ▼▼▼ Tagline と main を囲むラッパーを追加し、幅と中央寄せを設定 ▼▼▼ */}
          <div className="max-w-md mx-auto px-4 py-6"> {/* ← 上下の padding もここで調整 */}
            <Tagline /> {/* ★ ここに Tagline コンポーネントを配置 */}
            {/* <main> から幅と横パディング指定を削除 */}
            <main className="space-y-6">
              {children}
            </main>
          </div>
          {/* ▲▲▲ ラッパー終了 ▲▲▲ */}
          <Footer />
        </SupabaseProvider>
      </body>
    </html>
  )
}
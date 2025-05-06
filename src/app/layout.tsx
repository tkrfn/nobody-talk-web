// src/app/layout.tsx (修正版 - ウィジェットスクリプト追加)
import './globals.css'
import { Metadata } from 'next'
import Script from 'next/script' // ★ Script コンポーネントをインポート
import SupabaseProvider from '@/lib/SupabaseProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Tagline from '@/components/Tagline'
import Analytics from '@/components/Analytics' // Analytics コンポーネントもインポート

// metadata (変更なし、ファビコン設定含む)
export const metadata: Metadata = {
  title: 'Nobody Talk',
  description: '匿名掲示板「Nobody Talk」',
  icons: {
    icon: '/Random1.png',
  },
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
          <div className="max-w-md mx-auto px-4 py-6">
            <Tagline />
            <main className="space-y-6">
              {children}
            </main>
          </div>
          <Footer />
          <Analytics /> {/* GA用コンポーネント */}

          {/* ▼▼▼ X(Twitter) と TikTok の埋め込み用スクリプトを追加 ▼▼▼ */}
          {/* Twitter Widget Script */}
          <Script
            src="https://platform.twitter.com/widgets.js"
            strategy="lazyOnload" // 他のコンテンツ読み込み後に実行
            charSet="utf-8"
          />
          {/* TikTok Embed Script */}
          <Script
            src="https://www.tiktok.com/embed.js"
            strategy="lazyOnload" // 他のコンテンツ読み込み後に実行
          />
          {/* ▲▲▲ スクリプト追加ここまで ▲▲▲ */}

        </SupabaseProvider>
      </body>
    </html>
  )
}
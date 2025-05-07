// src/app/layout.tsx (Suspense対応 - Analytics用)
import './globals.css'
import { Metadata } from 'next'
import Script from 'next/script'
import SupabaseProvider from '@/lib/SupabaseProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Tagline from '@/components/Tagline'
import Analytics from '@/components/Analytics'
import React from 'react'; // ★ React をインポート (Suspense を使うため)

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
      <body className="min-h-screen font-sans bg-slate-900 text-slate-200"> {/* ダークモード風の配色例 */}
        <SupabaseProvider>
          {/* HeaderはuseSearchParams等を使っていないのでSuspenseは不要 (現時点のコードでは) */}
          <Header />

          <div className="max-w-md mx-auto px-4 py-6">
            {/* TaglineもuseSearchParams等を使っていないのでSuspenseは不要 (現時点のコードでは) */}
            <Tagline />
            <main className="space-y-6">
              {children}
            </main>
          </div>

          {/* FooterもuseSearchParams等を使っていないのでSuspenseは不要 (現時点のコードでは) */}
          <Footer />

          {/* ▼▼▼ Analytics を Suspense でラップ ▼▼▼ */}
          <React.Suspense fallback={null}> {/* fallbackはnullでも良いが、何か表示したい場合は適宜設定 */}
            <Analytics />
          </React.Suspense>
          {/* ▲▲▲ AnalyticsのSuspenseラップここまで ▲▲▲ */}

          <Script
            src="https://platform.twitter.com/widgets.js"
            strategy="lazyOnload"
            charSet="utf-8"
          />
          <Script
            src="https://www.tiktok.com/embed.js"
            strategy="lazyOnload"
          />
        </SupabaseProvider>
      </body>
    </html>
  )
}
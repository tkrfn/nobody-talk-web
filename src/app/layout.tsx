// src/app/layout.tsx (GTM 埋め込み版)
import './globals.css'
import { Metadata } from 'next'
import Script from 'next/script' // ★ Script コンポーネントをインポート
import SupabaseProvider from '@/lib/SupabaseProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Tagline from '@/components/Tagline'
// import Analytics from '@/components/Analytics' // ← GTMを使うので削除またはコメントアウト
import React from 'react'; // React はデフォルトで利用可能ですが、明示的に書いてもOK

export const metadata: Metadata = {
  title: 'Nobody Talk',
  description: '匿名掲示板「Nobody Talk」',
  icons: {
    icon: '/Random1.png', // publicディレクトリのRandom1.pngをファビコンとして使用
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 環境変数から GTM ID を取得 ( .env.local や Vercel の環境変数に NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX を設定)
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="ja">
      <head>
        {/* ▼▼▼ Google Tag Manager (<head> 内) ▼▼▼ */}
        {gtmId && ( // GTM ID が設定されている場合のみ実行
          <Script
            id="google-tag-manager-head"
            strategy="afterInteractive" // 他のコンテンツ読み込み後に実行
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}
        {/* ▲▲▲ Google Tag Manager (<head> 内) ここまで ▲▲▲ */}
      </head>
      <body className="min-h-screen font-sans bg-slate-900 text-slate-200"> {/* ダークモード風の配色例 */}
        {/* ▼▼▼ Google Tag Manager (noscript) (<body> 直後) ▼▼▼ */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="gtm_ns" // title属性を追加（アクセシビリティのため）
            ></iframe>
          </noscript>
        )}
        {/* ▲▲▲ Google Tag Manager (noscript) ここまで ▲▲▲ */}

        <SupabaseProvider>
          <Header />
          <div className="max-w-md mx-auto px-4 py-6">
            <Tagline />
            <main className="space-y-6">
              {children}
            </main>
          </div>
          <Footer />

          {/* ▼▼▼ 以前の Analytics コンポーネント呼び出しと Suspense を削除 ▼▼▼ */}
          {/*
          <React.Suspense fallback={null}>
            <Analytics />
          </React.Suspense>
          */}
          {/* ▲▲▲ ここまで削除 ▲▲▲ */}


          {/* 外部ウィジェット用スクリプト */}
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
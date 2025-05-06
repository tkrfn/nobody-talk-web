// src/components/Analytics.tsx
'use client' // フックを使うためクライアントコンポーネントにする

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

// windowオブジェクトにgtagが存在する可能性があることをTypeScriptに伝える型定義
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, params?: { [key: string]: string | number | boolean }) => void;
  }
}

export default function Analytics() {
  // 環境変数から測定IDを取得
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  // Next.jsのルーターフックで現在のパス情報を取得
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // パスや検索パラメータが変わるたびにページビューをGAに送信する
  useEffect(() => {
    // 測定IDが存在し、window.gtag関数が利用可能な場合に実行
    if (measurementId && typeof window !== 'undefined' && window.gtag) {
      // 現在のページのフルパス（例: /thread/123?sort=new）を組み立てる
      const url = pathname + searchParams.toString();
      // gtagを使ってpage_viewイベントを送信
      window.gtag('config', measurementId, {
        page_path: url,
      });
      // console.log(`GA Pageview: ${url}`); // 開発時の確認用ログ（必要ならコメント解除）
    }
    // pathname, searchParams, measurementId のいずれかが変更されたらこの Effect を再実行
  }, [pathname, searchParams, measurementId]);

  // ★ 測定IDが設定されていない、または本番環境(production)以外ではGAを読み込まない
  if (!measurementId || process.env.NODE_ENV !== 'production') {
    return null; // 何もレンダリングしない
  }

  // 本番環境かつ測定IDがある場合のみ、GAのスクリプトタグをレンダリング
  return (
    <>
      {/* Googleの gtag.js ライブラリ本体を読み込む */}
      <Script
        strategy="afterInteractive" // ページがインタラクティブになった後に読み込む
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      {/* GAの初期化と最初のページビュー送信を行うインラインスクリプト */}
      <Script
        id="google-analytics-init" // scriptタグにIDを付与
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname, // 最初に読み込まれたページのパス
            });
          `,
        }}
      />
    </>
  );
}
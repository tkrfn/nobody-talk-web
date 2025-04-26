// ────────────────────────────────────────────────────
// layout.tsx
// 既存ファイルを丸ごと上書きして、SupabaseProvider をラップ
// ────────────────────────────────────────────────────

import './globals.css'
import SupabaseProvider from './SupabaseProvider'

export const metadata = {
  title: 'Nobody Talk',
  description: '匿名で語り合う掲示板',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}

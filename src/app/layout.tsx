// src/app/layout.tsx
import './globals.css'
import SupabaseProvider from './SupabaseProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FAB from '@/components/FAB'

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
      <body className="flex flex-col min-h-screen relative">
        <SupabaseProvider />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        {/* FAB を全ページ共通で表示 */}
        <FAB />
        <Footer />
      </body>
    </html>
  )
}

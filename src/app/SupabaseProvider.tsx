// src/app/SupabaseProvider.tsx
'use client'
// ────────────────────────────────────────────────────
// SupabaseProvider.tsx
// 匿名ログインを signInAnonymously() で行う
// ────────────────────────────────────────────────────

import { useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SupabaseProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    ;(async () => {
      // 現在のセッションを確認
      const { data: { session }, error: getSessionError } = await supabase.auth.getSession()
      console.log('① getSession:', session, getSessionError)

      if (!session) {
        // 匿名サインインを実行
        const { data, error } = await supabase.auth.signInAnonymously()
        console.log('② signInAnonymously:', data, error)
      }
    })()

    // 認証状態の変化も監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('③ onAuthStateChange:', event, session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <>{children}</>
}

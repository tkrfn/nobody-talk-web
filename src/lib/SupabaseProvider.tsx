// src/lib/SupabaseProvider.tsx
'use client'

import React from 'react'

interface SupabaseProviderProps {
  children: React.ReactNode
}

export default function SupabaseProvider({ children }: SupabaseProviderProps) {
  return <>{children}</>
}

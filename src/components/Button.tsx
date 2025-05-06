// src/components/Button.tsx
import { ComponentPropsWithoutRef } from 'react'

export default function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
    >
      {children}
    </button>
  )
}

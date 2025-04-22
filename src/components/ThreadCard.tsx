// src/components/ThreadCard.tsx
import Link from 'next/link'
import type { Thread } from '@/types'

export function ThreadCard({ thread }: { thread: Thread }) {
  return (
    <li className="border border-white/10 rounded-xl p-4 space-y-1 bg-card">
      <Link
        href={`/thread/${thread.id}`}
        className="block hover:opacity-80 transition-opacity"
      >
        <h2 className="text-base font-bold text-text">{thread.title}</h2>
        <p className="text-sm leading-snug text-text whitespace-pre-wrap">{thread.body}</p>
        <p className="text-xs text-subtext mt-2">
          {new Date(thread.created_at).toLocaleString('ja-JP')}
        </p>
      </Link>
    </li>
  )
}

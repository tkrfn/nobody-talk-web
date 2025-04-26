// src/components/ThreadCard.tsx
import Link from 'next/link'

type Thread = {
  id: string
  title: string
  body: string
}

export function ThreadCard({ thread }: { thread: Thread }) {
  return (
    <Link href={`/thread/${thread.id}`}>
      <div className="border border-white/10 rounded-xl p-4 space-y-1 bg-card hover:opacity-80 transition">
        <h2 className="text-base font-semibold text-text line-clamp-1">{thread.title}</h2>
        <p className="text-sm text-subtext line-clamp-2">{thread.body}</p>
      </div>
    </Link>
  )
}

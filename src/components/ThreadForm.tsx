// src/components/ThreadForm.tsx
'use client'

import { useFormStatus } from 'react-dom'
import { Button } from './Button'

type Props = {
  action: (formData: FormData) => void
}

export function ThreadForm({ action }: Props) {
  const { pending } = useFormStatus()

  return (
    <form
      action={(formData) => {
        action(formData)
      }}
      className="space-y-4 p-4"
    >
      <input
        name="title"
        type="text"
        placeholder="タイトル"
        required
        className="w-full bg-surface border border-white/20 rounded-lg px-4 py-3 text-text placeholder-subtext focus:outline-none"
      />
      <textarea
        name="body"
        placeholder="本文"
        required
        rows={4}
        className="w-full bg-surface border border-white/20 rounded-lg px-4 py-3 text-text placeholder-subtext focus:outline-none"
      />
      <Button type="submit" disabled={pending}>
        {pending ? '投稿中…' : '投稿'}
      </Button>
    </form>
  )
}

'use client'

import { useFormStatus } from 'react-dom'
import { useRef } from 'react'
import { Button } from './Button'

type Props = {
  action: (formData: FormData) => void
}

export function CommentForm({ action }: Props) {
  const { pending } = useFormStatus()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = () => {
    setTimeout(() => {
      const target = document.getElementById('comment-list-end')
      target?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <form
      ref={formRef}
      action={action} // ← これでOK！
      onSubmit={handleSubmit} // ← submit後の補助処理だけ別に
      className="space-y-3"
    >
      <textarea
        name="body"
        placeholder="コメントを入力"
        required
        rows={3}
        className="w-full bg-surface border border-white/20 rounded-lg px-4 py-3 text-text placeholder-subtext text-base focus:outline-none focus:ring-1 focus:ring-primary resize-none"
      />
      <Button type="submit" disabled={pending}>
        {pending ? '投稿中...' : 'コメントを投稿'}
      </Button>
    </form>
  )
}

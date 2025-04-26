// src/components/ThreadForm.tsx
'use client'
import React, { useState } from 'react'
import { createThread } from '@/lib/thread-service'
import { useRouter } from 'next/navigation'

type ThreadFormProps = {
  onSuccess: () => void
}

export default function ThreadForm({ onSuccess }: ThreadFormProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createThread({ title, body })
      setTitle('')
      setBody('')
      onSuccess()
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('投稿に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          タイトル
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
        />
      </div>
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700">
          本文
        </label>
        <textarea
          id="body"
          rows={4}
          value={body}
          onChange={e => setBody(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded"
      >
        {isSubmitting ? '投稿中…' : '投稿する'}
      </button>
    </form>
  )
}

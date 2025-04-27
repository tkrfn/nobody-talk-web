// /src/components/CreateThreadModal.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

interface CreateThreadModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateThreadModal({ isOpen, onClose }: CreateThreadModalProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) setFile(files[0])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)

    let imageUrl = ''
    if (file && file.size > 0) {
      const ext = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${ext}`
      const { data, error } = await supabase
        .storage
        .from('thread-images')
        .upload(fileName, file)
      if (error) console.error(error)
      else imageUrl = data.path
    } else {
      const randomImages = [
        'https://placekitten.com/200/200?image=1',
        'https://placekitten.com/200/200?image=2',
        'https://placekitten.com/200/200?image=3',
        'https://placekitten.com/200/200?image=4',
      ]
      imageUrl = randomImages[Math.floor(Math.random() * randomImages.length)]
    }

    const { error } = await supabase
      .from('threads')
      .insert({ author_name: name || '', image_url: imageUrl, body: body || '' })
    if (error) console.error(error)

    setSubmitting(false)
    onClose()
    router.refresh()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg p-6 w-[90%] max-w-md space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold text-center text-white">新規スレッド作成</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          {/* 1. 投稿者名 */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-200">タイトル</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="匿名希望"
              required
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
            />
          </div>
          {/* 2. 画像アップロード */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-200">画像アップロード</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-300"
            />
          </div>
          {/* 3. 本文 */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-200">本文</label>
            <textarea
              name="body"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="ここに本文を入力"
              required
              className="w-full h-32 px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 bg-pink-500 rounded-lg text-white hover:bg-pink-600 transition"
          >
            {submitting ? '投稿中…' : '投稿する'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ファイル：/src/app/create-thread/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabaseClient'

export default function CreateThreadPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = (formData.get('name') as string) || ''
    const body = (formData.get('body') as string) || ''
    const entry = formData.get('image')

    let imageUrl = ''
    if (entry instanceof File && entry.size > 0) {
      const fileExt = entry.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const { data, error: uploadError } = await supabase
        .storage
        .from('thread-images')
        .upload(fileName, entry)
      if (uploadError) {
        console.error(uploadError)
      } else {
        imageUrl = data.path
      }
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
      .insert({ author_name: name, image_url: imageUrl, body })
    if (error) {
      console.error(error)
    }

    revalidatePath('/')
    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold text-center">スレッドを作成する</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">1. 投稿者名</label>
          <input
            name="name"
            type="text"
            required
            placeholder="匿名希望"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">2. 画像アップロード</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">3. 本文</label>
          <textarea
            name="body"
            required
            placeholder="ここに本文を入力"
            className="w-full border border-gray-300 rounded px-3 py-2 h-32 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
        >
          {submitting ? '投稿中…' : '投稿する'}
        </button>
      </form>
    </div>
  )
}

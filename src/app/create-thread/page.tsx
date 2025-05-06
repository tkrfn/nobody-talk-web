// src/app/create-thread/page.tsx
import { supabase } from '@/lib/supabaseClient'
import { createThread } from '@/lib/thread-service'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default function CreateThreadPage() {
  // Server Action
  async function handleThread(formData: FormData) {
    'use server'
    const author_name = formData.get('author_name')?.toString() ?? ''
    const title = formData.get('title')?.toString() ?? ''
    const body = formData.get('body')?.toString() ?? ''
    const imageFile = formData.get('image') as File | null

    let image_url: string | undefined
    if (imageFile && imageFile.size > 0) {
      // ファイル名にUUIDを付与してアップロード
      const ext = imageFile.name.split('.').pop()
      const filePath = `threads/${crypto.randomUUID()}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('threads')
        .upload(filePath, imageFile)
      if (uploadError) throw uploadError
      const { publicUrl } = supabase.storage.from('threads').getPublicUrl(uploadData.path)
      image_url = publicUrl
    }

    await createThread({ title, body, author_name, image_url })
    revalidatePath('/')
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">スレッド作成</h1>
      <form action={handleThread} encType="multipart/form-data" className="space-y-4">
        <div>
          <label htmlFor="author_name" className="block text-sm font-medium">投稿者名</label>
          <input
            type="text"
            name="author_name"
            id="author_name"
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium">画像アップロード（任意）</label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium">タイトル</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium">本文</label>
          <textarea
            name="body"
            id="body"
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            rows={5}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          投稿する
        </button>
      </form>
    </div>
  )
}

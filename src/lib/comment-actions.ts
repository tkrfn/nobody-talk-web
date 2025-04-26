// src/lib/comment-actions.ts
'use server'

import { supabase } from '@/supabase/supabase'
import { revalidatePath } from 'next/cache'

export async function addComment(threadId: string, formData: FormData) {
  const body = formData.get('body') as string
  if (!body || !threadId) {
    console.error('コメント本文またはスレッドIDが不足しています')
    return
  }

  const { error } = await supabase.from('comments').insert({
    thread_id: threadId,
    body,
  })

  if (error) {
    console.error('コメント投稿エラー:', error.message)
    return
  }

  revalidatePath(`/thread/${threadId}`)
}

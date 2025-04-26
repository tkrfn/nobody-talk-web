// src/lib/like-actions.ts
'use server'

import { supabase } from '@/supabase/supabase'
import { revalidatePath } from 'next/cache'

export async function addLike(commentId: string, threadId: string) {
  console.log('🛠 addLike called:', { commentId, threadId })

  const { error } = await supabase.from('likes').insert({
    comment_id: commentId,
  })

  if (error) {
    console.error('❌ Like insert error:', error.message)
    return
  }

  console.log('✅ Like inserted. Triggering revalidatePath...')
  revalidatePath(`/thread/${threadId}`)
}

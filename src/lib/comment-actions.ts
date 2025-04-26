// src/lib/comment-actions.ts
'use server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function createComment(formData: FormData) {
  const supabase = createServerActionClient({ cookies })
  const thread_id = formData.get('thread_id')?.toString() || ''
  const body      = formData.get('body')?.toString()      || ''

  await supabase
    .from('comments')
    .insert({ thread_id, body })

  // コメント追加後、同ページを再検証
  revalidatePath(`/thread/${thread_id}`)
}

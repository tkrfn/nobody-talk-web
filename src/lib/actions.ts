// src/lib/actions.ts
'use server'

import { supabase } from '@/supabase/supabase'
import { revalidatePath } from 'next/cache'

export async function createThread(formData: FormData) {
  const title = formData.get('title') as string
  const body = formData.get('body') as string

  if (!title || !body) return

  const { error } = await supabase.from('threads').insert({ title, body })

  if (error) {
    console.error('Error creating thread:', error)
    return
  }

  revalidatePath('/')
}

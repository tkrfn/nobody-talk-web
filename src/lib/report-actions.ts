// src/lib/report-actions.ts
'use server'

import { supabase } from '@/supabase/supabase'
import { revalidatePath } from 'next/cache'

export async function addReport(commentId: string, threadId: string) {
    console.log('🧭 addReport called:', { commentId, threadId })
  
    const { error } = await supabase.from('reports').insert({
      comment_id: commentId,
    })
  
    if (error) {
      console.error('❌ 通報の保存に失敗:', error.message)
      return
    }
  
    console.log('✅ 通報レコード追加成功')
    revalidatePath(`/thread/${threadId}`)
  }

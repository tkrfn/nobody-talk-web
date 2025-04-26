// src/lib/thread-service.ts
import { supabase } from '@/lib/supabaseClient'

// sort: 'new' | '24h' | 'week' | 'month' | 'all' | 'random'
export async function getThreadsSorted(sort: string) {
  if (sort === 'new') {
    const { data } = await supabase
      .from('threads')
      .select('*')
      .order('created_at', { ascending: false })
    return data || []
  }

  if (sort === 'random') {
    const { data } = await supabase
      .from('threads')
      .select('*')
    return (data || []).sort(() => Math.random() - 0.5)
  }

  let period: string
  switch (sort) {
    case '24h':
      period = '24 hours'; break
    case 'week':
      period = '7 days'; break
    case 'month':
      period = '30 days'; break
    default:
      period = '100 years'
  }
  const { data } = await supabase.rpc('get_popular_threads', { period })
  return data || []
}

// 新規スレッドを作成
export async function createThread(params: {
  title: string
  body: string
}) {
  const { data, error } = await supabase
    .from('threads')
    .insert({ title: params.title, body: params.body })
  if (error) throw error
  return data
}

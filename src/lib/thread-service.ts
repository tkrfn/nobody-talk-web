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

  // 24h, week, month, all: call RPC for popular threads
  let period = ''
  switch (sort) {
    case '24h':
      period = '24 hours'
      break
    case 'week':
      period = '7 days'
      break
    case 'month':
      period = '30 days'
      break
    case 'all':
      period = '100 years'
      break
    default:
      period = '100 years'
  }
  const { data } = await supabase.rpc('get_popular_threads', { period })
  return data || []
}

// 単一スレッドを取得
export async function getThreadById(id: string) {
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// 新規スレッドを作成
export async function createThread(params: {
  title: string
  body: string
  author_name: string
  image_url?: string
}) {
  const fallbacks = [
    'https://www.figma.com/design/.../node-id=198-5541',
    'https://www.figma.com/design/.../node-id=198-5513',
    'https://www.figma.com/design/.../node-id=198-5534',
    'https://www.figma.com/design/.../node-id=198-5527',
  ]
  const image_url =
    params.image_url && params.image_url.trim() !== ''
      ? params.image_url
      : fallbacks[Math.floor(Math.random() * fallbacks.length)]

  const { data, error } = await supabase
    .from('threads')
    .insert({
      title: params.title,
      body: params.body,
      author_name: params.author_name,
      image_url,
    })
  if (error) throw error
  return data
}

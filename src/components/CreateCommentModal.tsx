// src/components/CreateCommentModal.tsx (修正版 - 本文文字数制限追加)
'use client'

import { useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
// import { useRouter } from 'next/navigation' // window.location.reload() を使う場合は不要

interface Props {
  isOpen: boolean
  onClose: () => void
  threadId: string // コメント対象のスレッドID
}

export default function CreateCommentModal({ isOpen, onClose, threadId }: Props) {
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const MAX_COMMENT_LENGTH = 1000; // ★ 文字数制限を定数で定義

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // ★ 文字数チェックを追加
    if (body.trim().length > MAX_COMMENT_LENGTH) {
      alert(`コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください。`);
      setError(`コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください。`); // エラー表示用にもセット
      return;
    }
    // ★ 必須チェック (変更なし)
    if (!body.trim() || isLoading) return;

    setIsLoading(true);
    setError(null); // エラーをリセット

    try {
      const { error: insertError } = await supabase
        .from('comments')
        .insert([ { body: body.trim(), thread_id: threadId } ]); // trim() はここでも有効

      if (insertError) { throw insertError; }

      setBody('');
      onClose();
      window.location.reload();
      // router.refresh(); // こちらを使う場合

    } catch (err: any) {
      console.error('コメント投稿エラー:', err);
      setError(err.message || 'コメントの投稿中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4 text-white">コメントを作成</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div> {/* ラベルとカウンターをグループ化 */}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={`コメントを入力… (${MAX_COMMENT_LENGTH}文字まで)`} // Placeholder 更新
              rows={5} // 少し高さを増やす
              maxLength={MAX_COMMENT_LENGTH} // ★ maxLength 属性を追加
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              required
              disabled={isLoading}
            />
            {/* ▼▼▼ 文字数カウンター (任意) ▼▼▼ */}
            <div className={`text-right text-xs ${body.length > MAX_COMMENT_LENGTH ? 'text-red-400' : 'text-gray-400'}`}>
              {body.length} / {MAX_COMMENT_LENGTH}
            </div>
            {/* ▲▲▲ 文字数カウンター ▲▲▲ */}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 rounded bg-gray-600 text-gray-200 hover:bg-gray-500 transition disabled:opacity-50">
              キャンセル
            </button>
            <button type="submit" disabled={isLoading || !body.trim()} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? '投稿中...' : 'コメントを投稿'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
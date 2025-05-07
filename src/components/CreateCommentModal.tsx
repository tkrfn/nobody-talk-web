// src/components/CreateCommentModal.tsx (no-explicit-any 修正版)
'use client'

import { useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Props {
  isOpen: boolean
  onClose: () => void
  threadId: string
}

export default function CreateCommentModal({ isOpen, onClose, threadId }: Props) {
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const MAX_COMMENT_LENGTH = 1000;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (body.trim().length > MAX_COMMENT_LENGTH) {
      alert(`コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください。`);
      setError(`コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください。`);
      return;
    }
    if (!body.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('comments')
        .insert([ { body: body.trim(), thread_id: threadId } ]);

      if (insertError) { throw insertError; }

      setBody('');
      onClose();
      window.location.reload();

    } catch (err: unknown) { // ★ any から unknown に変更
      console.error('コメント投稿エラー:', err);
      // err が Error インスタンスで message プロパティを持つか確認
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as any).message === 'string') {
        setError((err as any).message); // より安全なアクセス
      }
      else {
        setError('コメントの投稿中にエラーが発生しました。');
      }
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
          <div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={`コメントを入力… (${MAX_COMMENT_LENGTH}文字まで)`}
              rows={5}
              maxLength={MAX_COMMENT_LENGTH}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              required
              disabled={isLoading}
            />
            <div className={`text-right text-xs ${body.length > MAX_COMMENT_LENGTH ? 'text-red-400' : 'text-gray-400'}`}>
              {body.length} / {MAX_COMMENT_LENGTH}
            </div>
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
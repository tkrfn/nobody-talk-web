// src/components/CreateCommentModal.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  threadId: string;
}

export default function CreateCommentModal({
  isOpen,
  onClose,
  threadId,
}: Props) {
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const MAX_COMMENT_LENGTH = 1_000;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (body.trim().length > MAX_COMMENT_LENGTH) {
      setError(`コメントは ${MAX_COMMENT_LENGTH} 文字以内で入力してください。`);
      return;
    }

    setIsLoading(true);
    try {
      const { error: insertError } = await supabase
        .from('comments')
        .insert({ thread_id: threadId, body });

      if (insertError) throw insertError;

      setBody('');
      onClose();
      window.location.reload();
    } catch (err: unknown) {
      console.error('コメント投稿エラー:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'コメントの投稿中にエラーが発生しました。';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4 rounded-lg bg-white p-6 shadow-xl"
      >
        <textarea
          className="h-32 w-full resize-none rounded border p-2"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={MAX_COMMENT_LENGTH}
          placeholder="コメントを入力..."
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2"
          >
            キャンセル
          </button>
          <button
            disabled={isLoading}
            className="rounded bg-pink-500 px-4 py-2 text-white hover:bg-pink-600 disabled:opacity-50"
          >
            投稿
          </button>
        </div>
      </form>
    </div>
  );
}

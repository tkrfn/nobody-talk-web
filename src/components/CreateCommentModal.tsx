// src/components/CreateCommentModal.tsx (画像投稿対応版)
'use client'

import { useState, FormEvent, ChangeEvent, useEffect } from 'react' // ChangeEvent, useEffect を追加
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'; // Imageコンポーネントをインポート

interface Props {
  isOpen: boolean
  onClose: () => void
  threadId: string
}

interface ErrorWithMessage {
  message: string;
}

function hasMessage(err: unknown): err is ErrorWithMessage {
  return (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as ErrorWithMessage).message === 'string'
  );
}

export default function CreateCommentModal({ isOpen, onClose, threadId }: Props) {
  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null); // ★ 画像ファイル用のstate
  const [preview, setPreview] = useState<string | null>(null); // ★ 画像プレビュー用のstate
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const MAX_COMMENT_LENGTH = 1000;

  // 画像プレビュー用のuseEffect
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl); // クリーンアップ
  }, [file]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    // input要素の値をリセットするために、フォームリセットを使うか、inputにkeyを付与して変更する
    // ここでは簡易的にnullにするだけ
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (body.trim().length > MAX_COMMENT_LENGTH) {
      setError(`コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください。`);
      return;
    }
    // 本文が空でも画像があれば投稿を許可するかどうかは要件次第
    // ここでは本文または画像どちらかがあればOKとする (例)
    if (!body.trim() && !file) {
        setError('コメント本文を入力するか、画像を選択してください。');
        return;
    }
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    let imageUrl: string | null = null;

    try {
      // 画像が選択されていればアップロード
      if (file) {
        const ext = file.name.split('.').pop();
        const fileName = `comments/${threadId}/${crypto.randomUUID()}.${ext}`; // 例: comments/[threadId]/[randomId].[ext]
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('comment-images') // ★ コメント画像用のバケット名に変更
          .upload(fileName, file, {
            contentType: file.type || 'application/octet-stream',
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`画像アップロードエラー: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from('comment-images') // ★ コメント画像用のバケット名
          .getPublicUrl(uploadData.path);
        imageUrl = urlData?.publicUrl || null;
      }

      // データベースにコメントを保存
      const { error: insertError } = await supabase
        .from('comments')
        .insert([{ body: body.trim(), thread_id: threadId, image_url: imageUrl }]); // ★ image_url を追加

      if (insertError) {
        throw insertError;
      }

      setBody('');
      setFile(null); // フォームリセット
      onClose();
      window.location.reload(); // ページをリロードして新しいコメントを表示

    } catch (err: unknown) {
      console.error('コメント投稿エラー:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (hasMessage(err)) {
        setError(err.message);
      } else {
        setError('コメントの投稿中にエラーが発生しました。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-3" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4 text-white">コメントを作成</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={`コメントを入力… (${MAX_COMMENT_LENGTH}文字まで)`}
              rows={4} // 少し高さを調整
              maxLength={MAX_COMMENT_LENGTH}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              disabled={isLoading}
            />
            <div className={`text-right text-xs ${body.length > MAX_COMMENT_LENGTH ? 'text-red-400' : 'text-gray-400'}`}>
              {body.length} / {MAX_COMMENT_LENGTH}
            </div>
          </div>

          {/* ▼▼▼ 画像アップロードUIを追加 ▼▼▼ */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">画像 (任意)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600 cursor-pointer"
              disabled={isLoading}
            />
            {preview && (
              <div className="mt-2 relative inline-block">
                <Image src={preview} alt="プレビュー" width={80} height={80} className="object-contain rounded bg-slate-700" />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none hover:bg-red-700"
                  disabled={isLoading}
                >
                  ×
                </button>
              </div>
            )}
          </div>
          {/* ▲▲▲ 画像アップロードUIここまで ▲▲▲ */}


          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 rounded bg-gray-600 text-gray-200 hover:bg-gray-500 transition disabled:opacity-50">
              キャンセル
            </button>
            <button type="submit" disabled={isLoading || (!body.trim() && !file) } className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? '投稿中...' : 'コメントを投稿'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
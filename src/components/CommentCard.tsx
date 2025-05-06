// src/components/CommentCard.tsx (修正版 - ClickableBody を使用)
'use client'; // ClickableBody を使うので念のため

import React from 'react'; // ★ React をインポート
import LikeButton from '@/components/LikeButton';
import ClickableBody from './ClickableBody'; // ★ ClickableBody をインポート

// Comment 型定義 (ClickableBodyに合わせて body を調整)
export interface Comment {
  id: string;
  body: string | null | undefined; // ★ null/undefined 許容に変更
  created_at: string;
  like_count?: number;
  author_name?: string; // 匿名なら使わないかも
}

// Props 型定義
interface Props {
  comment: Comment;
  className?: string;
  highlight?: boolean;
}

export default function CommentCard({ comment, className = '', highlight }: Props) {
  // 日付フォーマット
  const formattedDate = comment.created_at
    ? new Date(comment.created_at).toLocaleString('ja-JP', { dateStyle: 'short', timeStyle: 'short' })
    : '';

  return (
    <div
      // カードスタイル (変更なし)
      className={`bg-white rounded-2xl shadow p-4 transition hover:shadow-md border border-card-border ${
        highlight ? 'ring-2 ring-offset-2 ring-pink-400' : ''
      } ${className}`}
    >
      {/* ▼▼▼ コメント本文を ClickableBody で表示 ▼▼▼ */}
      {/* 元の <p> タグでの表示をコメントアウトまたは削除 */}
      {/* <p className="text-sm text-gray-800 whitespace-pre-wrap break-words mb-3">{comment.body}</p> */}
      <ClickableBody body={comment.body} /> {/* ★ ClickableBody を使用 */}
      {/* ▲▲▲ コメント本文表示変更 ▲▲▲ */}

      {/* フッター部分 (変更なし) */}
      <div className="flex items-center justify-between mt-3">
        {/* 投稿者名を表示したい場合はここに追加 */}
        {/* <span className="text-xs text-gray-500 mr-2">👤 {comment.author_name || '匿名さん'}</span> */}
        <span className="text-xs text-gray-500">
          {formattedDate}
        </span>
        <LikeButton commentId={comment.id} initialCount={comment.like_count ?? 0} />
      </div>
    </div>
  );
}
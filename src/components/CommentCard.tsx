// src/components/CommentCard.tsx (画像ライトボックス対応版)
'use client';

import React, { useState } from 'react'; // ★ useState をインポート
import LikeButton from '@/components/LikeButton';
import ClickableBody from './ClickableBody';
import Image from 'next/image';
import ImageLightbox from './ImageLightbox'; // ★ 作成したライトボックスコンポーネントをインポート

export interface Comment {
  id: string;
  body: string | null | undefined;
  created_at: string;
  like_count?: number;
  author_name?: string;
  image_url?: string | null;
}

interface Props {
  comment: Comment;
  className?: string;
  highlight?: boolean;
}

export default function CommentCard({ comment, className = '', highlight }: Props) {
  const formattedDate = comment.created_at
    ? new Date(comment.created_at).toLocaleString('ja-JP', { dateStyle: 'short', timeStyle: 'short' })
    : '';

  // ★ ライトボックス表示用のstateを追加
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  return (
    <> {/* ★ Fragmentで囲む */}
      <div
        className={`
          bg-slate-700 text-slate-200 rounded-2xl shadow p-4 transition
          hover:bg-slate-600 border border-slate-600
          ${highlight ? 'ring-2 ring-offset-2 ring-pink-400' : ''}
          ${className}
        `}
      >
        {comment.image_url && (
          <div
            className="mb-3 relative aspect-video max-w-xs mx-auto cursor-zoom-in" // ★ cursor-zoom-in を追加
            onClick={() => handleImageClick(comment.image_url!)} // ★ 画像クリック時の処理を追加
          >
            <Image
              src={comment.image_url}
              alt="コメント画像"
              fill
              className="object-contain rounded"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <ClickableBody body={comment.body} />

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-400">
            {formattedDate}
          </span>
          <LikeButton commentId={comment.id} initialCount={comment.like_count ?? 0} />
        </div>
      </div>

      {/* ★ ライトボックスコンポーネントの表示 */}
      {lightboxOpen && selectedImage && (
        <ImageLightbox
          src={selectedImage}
          alt="拡大画像"
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
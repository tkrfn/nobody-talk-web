// src/components/ImageLightbox.tsx (新規作成)
'use client';

import Image from 'next/image';
import React from 'react';

interface ImageLightboxProps {
  src: string | null; // 表示する画像のURL
  alt: string;
  onClose: () => void; // モーダルを閉じる関数
}

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  if (!src) {
    return null; // srcがなければ何も表示しない
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose} // 背景クリックで閉じる
    >
      <div
        className="relative w-full h-full max-w-4xl max-h-[90vh]" // 表示する画像の最大サイズを調整
        onClick={(e) => e.stopPropagation()} // 画像クリックで閉じないようにイベント伝播を停止
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain" // アスペクト比を保ってコンテナに収める
          priority // フルスクリーン表示なので優先的に読み込む
        />
      </div>
      {/* 右上に閉じるボタン (任意) */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl bg-black/50 rounded-full p-2 leading-none hover:bg-black/70"
        aria-label="閉じる"
      >
        &times;
      </button>
    </div>
  );
}
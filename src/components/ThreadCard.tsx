// src/components/ThreadCard.tsx (型エラー修正版)
'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import ClickableBody from './ClickableBody';

export interface ThreadCardProps {
  thread: {
    id: string;
    title: string;
    body: string | null | undefined;
    author_name?: string;
    created_at: string;
    image_url?: string | null;
    user_id?: string;
    comment_count: number;
    popularity_score?: number;
  };
  isDetailPage?: boolean;
}

// --- Helper Functions (変更なし) ---
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}
function getTikTokVideoId(url: string): string | null {
  const match = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
  return match && match[1] ? match[1] : null;
}
const linkOrNewlineRegex = /((?:https?:\/\/)[^\s<>"'()]*[^\s<>"'().,?!])|(\n)/gi;

// ClickableBody は別ファイルからインポートされている前提

export default function ThreadCard({ thread, isDetailPage = false }: ThreadCardProps) {
  // const Container = isDetailPage ? 'div' : Link; // ★ この行は不要になります
  // const containerProps = isDetailPage ? {} : { href: `/thread/${thread.id}` }; // ★ この行は不要になります
  const bodyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDetailPage) {
      const loadWidgets = () => {
        // @ts-expect-error window.twttr is a global variable injected by Twitter's script and not typed in this project.
        if (typeof window !== 'undefined' && window.twttr) {
           // @ts-expect-error twttr.widgets or its load method might not be available or typed.
           if (window.twttr.widgets?.load) {
              try {
                 const target = bodyContainerRef.current || document.body;
                 // @ts-expect-error The load method's signature or existence is not strictly typed here.
                 window.twttr.widgets.load(target);
              } catch (e) { console.error("Error executing twttr.widgets.load:", e); }
           }
        }
      };
      const timerId = setTimeout(loadWidgets, 200);
      return () => clearTimeout(timerId);
    }
  }, [isDetailPage, thread.body, thread.id]);

  const cardClassNames = `
    bg-slate-700 text-slate-100  rounded-2xl shadow
    border border-slate-600  transition
    ${isDetailPage
      ? 'block p-4'
      : 'hover:bg-slate-600 flex items-center gap-3 p-3 rounded-xl'
    }
  `;

  const cardContent = (
    <>
      {thread.image_url && (
        <div className={`relative flex-shrink-0 ${
            isDetailPage
              ? 'w-[100px] h-[100px] mb-4 bg-slate-600 rounded-lg overflow-hidden flex items-center justify-center'
              : 'w-12 h-12 relative'
        }`}>
          <Image
            src={thread.image_url}
            alt="スレッド画像"
            fill={!isDetailPage}
            width={isDetailPage ? 100 : undefined}
            height={isDetailPage ? 100 : undefined}
            className={`object-contain ${isDetailPage ? '' : 'rounded-md bg-slate-800'}`}
            sizes={isDetailPage ? "100px" : "48px"}
            priority={false}
            loading={isDetailPage ? "lazy" : undefined}
          />
        </div>
      )}
      <div className={`flex flex-col justify-between min-w-0 ${!isDetailPage ? 'flex-grow' : ''}`}>
         <div>
          <h2 className={`text-lg font-semibold mb-1 ${!isDetailPage ? 'truncate' : ''}`}>{thread.title}</h2>
          {isDetailPage ? (
            <div ref={bodyContainerRef}>
              <ClickableBody body={thread.body} charLimit={1000} />
            </div>
          ) : (
            null
          )}
        </div>
        {isDetailPage ? (
            <div className="mt-1 text-xs text-slate-400 flex items-center justify-between">
              <span>👤 {thread.author_name || '匿名さん'}</span>
              <time dateTime={thread.created_at}>{new Date(thread.created_at).toLocaleString('ja-JP', { dateStyle: 'short', timeStyle: 'short' })}</time>
            </div>
        ) : (
             <div className="mt-0 text-xs text-slate-400 flex items-center justify-between">
                 <div className="flex items-center">
                     <span>👤 {thread.author_name || '匿名さん'}</span>
                     <span className="mx-1">·</span>
                     <time dateTime={thread.created_at}>{new Date(thread.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' })}</time>
                 </div>
                 <div className="flex items-center">
                     <Image
                       src="/comment.svg"
                       alt="コメント"
                       width={16}
                       height={16}
                       className="mr-0.5"
                     />
                     <span>{thread.comment_count}</span>
                 </div>
             </div>
        )}
      </div>
    </>
  );

  // ★ isDetailPage に基づいてレンダリングするコンポーネントを切り替える
  if (isDetailPage) {
    return (
      <div className={cardClassNames}>
        {cardContent}
      </div>
    );
  } else {
    return (
      <Link href={`/thread/${thread.id}`} className={cardClassNames}>
        {cardContent}
      </Link>
    );
  }
}
// src/components/ThreadCard.tsx
'use client'; // クライアントコンポーネント

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import ClickableBody from './ClickableBody';

// Props の型定義
interface ThreadCardProps {
  thread: {
    id: string;
    title: string;
    body: string | null | undefined;
    author_name?: string;
    created_at: string;
    image_url?: string | null;
    user_id?: string;
    comment_count: number;
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

// --- ClickableBody Component (変更なし、ただし文字色は親から継承される想定) ---
function ClickableBody({ body, charLimit = 1000 }: { body: string | null | undefined, charLimit?: number }) {
  if (!body) { return <div className="text-sm mb-2"></div>; } // 文字色クラスは削除 (親から継承)
  const limitedBody = body.length > charLimit ? body.slice(0, charLimit) + '...' : body;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  linkOrNewlineRegex.lastIndex = 0;
  while ((match = linkOrNewlineRegex.exec(limitedBody)) !== null) {
    const url = match[1];
    const newline = match[2];
    const startIndex = match.index;

    if (startIndex > lastIndex) {
      elements.push(<React.Fragment key={`text-${lastIndex}`}>{limitedBody.substring(lastIndex, startIndex)}</React.Fragment>);
    }

    if (newline) {
      elements.push(<React.Fragment key={`br-${startIndex}`}></React.Fragment>);
    } else if (url) {
      const youtubeVideoId = getYouTubeVideoId(url);
      const tiktokVideoId = getTikTokVideoId(url);
      const isX = url.includes('twitter.com') || url.includes('x.com');

      if (youtubeVideoId) {
        elements.push(
          <div key={`${startIndex}-youtube`} className="my-3 aspect-video max-w-full mx-auto" style={{ maxWidth: '560px' }}>
            <iframe className="w-full h-full rounded" src={`https://www.youtube.com/embed/$${youtubeVideoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>
        );
      } else if (isX) {
        elements.push(
          <blockquote key={`${startIndex}-tweet`} className="twitter-tweet" data-theme="dark" data-dnt="true"> {/* data-theme="dark" に変更 */}
             <a href={url} className="text-sky-400 hover:text-sky-300">ツイートを読み込み中... {url}</a> {/* リンク色を調整 */}
          </blockquote>
        );
      } else if (tiktokVideoId) {
         elements.push(
           <blockquote key={`${startIndex}-tiktok`} className="tiktok-embed" cite={url} data-video-id={tiktokVideoId} style={{ maxWidth: '605px', minWidth: '325px' }}>
             <section><a target="_blank" rel="noopener noreferrer" title="TikTok video" href={url} className="text-sky-400 hover:text-sky-300">TikTok 動画を読み込み中... {url}</a></section> {/* リンク色を調整 */}
           </blockquote>
         );
      } else {
        let href = url;
        if (href.toLowerCase().startsWith('www.')) { href = 'http://' + href; }
        if (!href.toLowerCase().startsWith('http')) {
           elements.push(<React.Fragment key={`text-${startIndex}`}>{url}</React.Fragment>);
        } else {
           // リンク色を明るめに調整
           elements.push( <a key={`link-${startIndex}`} href={href} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 break-all">{url}</a> );
        }
      }
    }
    lastIndex = linkOrNewlineRegex.lastIndex;
  }

  if (lastIndex < limitedBody.length) {
    elements.push(<React.Fragment key={`text-${lastIndex}`}>{limitedBody.substring(lastIndex)}</React.Fragment>);
  }

  // 親要素から文字色を継承するため、ここでは text-gray-800 を削除
  return (
    <div className="text-sm whitespace-pre-wrap break-words mb-2 space-y-2">
      {elements}
    </div>
  );
}


// --- ThreadCard Component 本体 ---
export default function ThreadCard({ thread, isDetailPage = false }: ThreadCardProps) {
  const Container = isDetailPage ? 'div' : Link;
  const containerProps = isDetailPage ? {} : { href: `/thread/${thread.id}` };
  const bodyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDetailPage) {
      const loadWidgets = () => {
        // @ts-expect-error
        if (typeof window !== 'undefined' && window.twttr) {
           // @ts-expect-error
           if (window.twttr.widgets?.load) {
              try {
                 const target = bodyContainerRef.current || document.body;
                 // @ts-expect-error
                 window.twttr.widgets.load(target);
              } catch (e) { console.error("Error executing twttr.widgets.load:", e); }
           }
        }
      };
      const timerId = setTimeout(loadWidgets, 200);
      return () => clearTimeout(timerId);
    }
  }, [isDetailPage, thread.body, thread.id]);

  return (
    <Container
      {...containerProps}
      className={`
        bg-slate-800 text-slate-100  rounded-2xl shadow 
        border border-slate-600  transition
        ${isDetailPage 
          ? 'block p-4' 
          : 'hover:bg-slate-600 flex items-center gap-3 p-3 rounded-xl'
        }
      `}
    >
      {/* --- 画像表示部分 (サムネイル画像の背景を調整) --- */}
      {thread.image_url && (
        <div className={`relative flex-shrink-0 ${
            isDetailPage 
              ? 'w-[100px] h-[100px] mb-4 bg-slate-600 rounded-lg overflow-hidden flex items-center justify-center' // 背景色変更
              : 'w-12 h-12 relative'
        }`}>
          {isDetailPage ? (
            <Image
              src={thread.image_url}
              alt="スレッド画像"
              width={100}
              height={100}
              className="object-contain"
              loading="lazy"
            />
          ) : (
            <Image
              src={thread.image_url}
              alt="スレッド画像"
              fill
              className="object-contain rounded-md bg-slate-800" // サムネイル背景をさらに暗く
              sizes="48px"
              priority={false}
            />
          )}
        </div>
      )}
      {/* --- テキスト部分 --- */}
      <div className={`flex flex-col justify-between min-w-0 ${!isDetailPage ? 'flex-grow' : ''}`}>
         <div>
          {/* タイトル色は親から継承 (text-slate-100) */}
          <h2 className={`text-lg font-semibold mb-1 ${!isDetailPage ? 'truncate' : ''}`}>{thread.title}</h2>
          {isDetailPage ? (
            <div ref={bodyContainerRef}>
              {/* ClickableBody の文字色は親から継承 (text-slate-100) */}
              <ClickableBody body={thread.body} charLimit={1000} />
            </div>
          ) : (
            null
          )}
        </div>
        {/* --- フッター情報 (文字色とアイコン色を調整) --- */}
        {isDetailPage ? (
            <div className="mt-1 text-xs text-slate-400 flex items-center justify-between"> {/* 文字色変更 */}
              <span>👤 {thread.author_name || '匿名さん'}</span>
              <time dateTime={thread.created_at}>{new Date(thread.created_at).toLocaleString('ja-JP', { dateStyle: 'short', timeStyle: 'short' })}</time>
            </div>
        ) : (
             <div className="mt-0 text-xs text-slate-400 flex items-center justify-between"> {/* 文字色変更 */}
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
                       className="mr-0.5" // SVG自体の色に依存、またはCSSフィルターで調整
                       // style={{ filter: 'brightness(0) invert(1)' }} // 例: 白くする場合のフィルター (SVGが単色の場合)
                       // もしSVGがfill="currentColor"なら、親のtext-slate-400が効く
                     />
                     <span>{thread.comment_count}</span>
                 </div>
             </div>
        )}
      </div>
    </Container>
  );
}
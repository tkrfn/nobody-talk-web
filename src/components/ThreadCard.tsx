// src/components/ThreadCard.tsx (最終版 - 公式Widget Script方式, デバッグログ・useEffect調整版)
'use client'; // クライアントコンポーネント

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react'; // ★ useRef をインポート
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
  };
  isDetailPage?: boolean; // 詳細ページフラグ (デフォルト false)
}

// --- Helper Functions ---
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

// --- ClickableBody Component (Widget Script 用) ---
function ClickableBody({ body, charLimit = 1000 }: { body: string | null | undefined, charLimit?: number }) {
  if (!body) { return <div className="text-sm text-gray-600 mb-2"></div>; }
  const limitedBody = body.length > charLimit ? body.slice(0, charLimit) + '...' : body;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  // デバッグログ (必要ならコメント解除)
  // console.log('[ClickableBody] Received body prop:', body);
  // console.log('[ClickableBody] Processing limitedBody:', limitedBody);

  linkOrNewlineRegex.lastIndex = 0; // Ensure regex index is reset
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
      // console.log('[ClickableBody] Regex Matched URL:', url); // デバッグ用
      const youtubeVideoId = getYouTubeVideoId(url);
      const tiktokVideoId = getTikTokVideoId(url);
      const isX = url.includes('twitter.com') || url.includes('x.com');

      if (youtubeVideoId) {
        // console.log('[ClickableBody] Rendering YouTube iframe for:', url); // デバッグ用
        elements.push(
          <div key={`${startIndex}-youtube`} className="my-3 aspect-video max-w-full mx-auto" style={{ maxWidth: '560px' }}>
            <iframe className="w-full h-full rounded" src={`https://www.youtube.com/embed/${youtubeVideoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>
        );
      } else if (isX) {
        // console.log('[ClickableBody] Rendering Twitter blockquote for:', url); // デバッグ用
        elements.push(
          <blockquote key={`${startIndex}-tweet`} className="twitter-tweet" data-theme="light" data-dnt="true">
             <a href={url}>ツイートを読み込み中... {url}</a>
          </blockquote>
        );
      } else if (tiktokVideoId) {
        // console.log('[ClickableBody] Rendering TikTok blockquote for:', url); // デバッグ用
         elements.push(
           <blockquote key={`${startIndex}-tiktok`} className="tiktok-embed" cite={url} data-video-id={tiktokVideoId} style={{ maxWidth: '605px', minWidth: '325px' }}>
             <section><a target="_blank" rel="noopener noreferrer" title="TikTok video" href={url}>TikTok 動画を読み込み中... {url}</a></section>
           </blockquote>
         );
      } else {
        // console.log('[ClickableBody] Creating standard link for:', url); // デバッグ用
        let href = url;
        if (href.toLowerCase().startsWith('www.')) { href = 'http://' + href; }
        if (!href.toLowerCase().startsWith('http')) {
           elements.push(<React.Fragment key={`text-${startIndex}`}>{url}</React.Fragment>);
        } else {
           elements.push( <a key={`link-${startIndex}`} href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{url}</a> );
        }
      }
    }
    lastIndex = linkOrNewlineRegex.lastIndex;
  }

  if (lastIndex < limitedBody.length) {
    elements.push(<React.Fragment key={`text-${lastIndex}`}>{limitedBody.substring(lastIndex)}</React.Fragment>);
  }

  return (
    <div className="text-sm text-gray-800 whitespace-pre-wrap break-words mb-2 space-y-2">
      {elements}
    </div>
  );
}


// --- ThreadCard Component 本体 ---
export default function ThreadCard({ thread, isDetailPage = false }: ThreadCardProps) {
  const Container = isDetailPage ? 'div' : Link;
  const containerProps = isDetailPage ? {} : { href: `/thread/${thread.id}` };
  const bodyContainerRef = useRef<HTMLDivElement>(null); // 本文コンテナへの参照

  // ▼▼▼ ウィジェット読み込み用 useEffect (デバッグログ強化・対象指定・遅延実行) ▼▼▼
  useEffect(() => {
    if (isDetailPage) {
      console.log('[ThreadCard useEffect] Effect triggered.');

      const loadWidgets = () => {
        console.log('[ThreadCard useEffect] Attempting to load widgets...');
        // --- Twitter ---
        // @ts-ignore
        if (typeof window !== 'undefined' && window.twttr) {
           console.log('[ThreadCard useEffect] window.twttr object:', window.twttr);
           // @ts-ignore
           if (window.twttr.widgets?.load) {
              console.log('[ThreadCard useEffect] window.twttr.widgets.load() found. Executing...');
              try {
                 const target = bodyContainerRef.current || document.body;
                 console.log('[ThreadCard useEffect] Targeting element for widgets.load:', target);
                 // @ts-ignore
                 window.twttr.widgets.load(target);
              } catch (e) { console.error("Error executing twttr.widgets.load:", e); }
           } else { console.log('[ThreadCard useEffect] load function not found on twttr.widgets object.'); }
        } else { console.log('[ThreadCard useEffect] window.twttr object not found yet.'); }
        // TikTok は自動ロードを期待
      };

      // 少し遅延させて実行
      const timerId = setTimeout(loadWidgets, 200);

      return () => clearTimeout(timerId);
    }
  }, [isDetailPage, thread.body, thread.id]);
  // ▲▲▲ useEffect ▲▲▲

  return (
    <Container
      {...containerProps}
      className={`bg-white rounded-2xl shadow border border-card-border transition ${
        isDetailPage ? 'block p-4' : 'hover:shadow-md flex items-center gap-3 p-3 rounded-xl'
      }`}
    >
      {/* --- 画像表示部分 --- */}
      {thread.image_url && (
        <div className={`relative flex-shrink-0 ${
            isDetailPage ? 'w-[100px] h-[100px] mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center' : 'w-12 h-12 relative'
        }`}>
          {isDetailPage ? ( <img src={thread.image_url} alt="スレッド画像" className="max-w-full max-h-full object-contain" loading="lazy"/>
          ) : ( <Image src={thread.image_url} alt="スレッド画像" fill className="object-contain rounded-md bg-gray-100" sizes="48px" priority={false} />
          )}
        </div>
      )}
      {/* --- テキスト部分 --- */}
      <div className={`flex flex-col justify-between min-w-0 ${!isDetailPage ? 'flex-grow' : ''}`}>
         <div>
          <h2 className={`text-lg font-semibold mb-1 ${!isDetailPage ? 'truncate' : ''}`}>{thread.title}</h2>
          {isDetailPage ? (
            // ▼▼▼ ClickableBody を含む div に ref を設定 ▼▼▼
            <div ref={bodyContainerRef}>
              <ClickableBody body={thread.body} charLimit={1000} />
            </div>
            // ▲▲▲ ref を設定 ▲▲▲
          ) : (
            null
          )}
        </div>
        {/* --- フッター情報 --- */}
        {isDetailPage ? (
            <div className="mt-1 text-xs text-gray-500 flex items-center justify-between">
              <span>👤 {thread.author_name || '匿名さん'}</span>
              <time dateTime={thread.created_at}>{new Date(thread.created_at).toLocaleString('ja-JP', { dateStyle: 'short', timeStyle: 'short' })}</time>
            </div>
        ) : (
             <div className="mt-0 text-xs text-gray-500 flex items-center">
                 <span>👤 {thread.author_name || '匿名さん'}</span>
                 <span className="mx-1">·</span>
                 <time dateTime={thread.created_at}>{new Date(thread.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' })}</time>
             </div>
        )}
      </div>
    </Container>
  );
}
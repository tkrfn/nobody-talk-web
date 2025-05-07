// src/components/ClickableBody.tsx (テキスト色修正版)
'use client'; // Client Component

import React from 'react';

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

// --- Component Props (変更なし) ---
interface Props {
  body: string | null | undefined;
  charLimit?: number;
}

export default function ClickableBody({ body, charLimit }: Props) {
  if (!body) {
    // ★ text-gray-800 を削除 (親から文字色を継承)
    return <div className="text-sm whitespace-pre-wrap break-words mb-2"></div>;
  }

  const limitedBody = (charLimit && body.length > charLimit) ? body.slice(0, charLimit) + '...' : body;

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
        elements.push( <div key={`${startIndex}-youtube`} className="my-3 aspect-video max-w-full mx-auto" style={{ maxWidth: '560px' }}><iframe className="w-full h-full rounded" src={`https://www.youtube.com/embed/${youtubeVideoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe></div> );
      } else if (isX) {
        // ★ X (Twitter) のテーマを dark に、リンク色も調整
        elements.push( <blockquote key={`${startIndex}-tweet`} className="twitter-tweet" data-theme="dark" data-dnt="true"><a href={url} className="text-sky-400 hover:text-sky-300">ツイートを読み込み中... {url}</a></blockquote> );
      } else if (tiktokVideoId) {
         // ★ TikTok のリンク色も調整 (TikTok埋め込み自体がテーマを持つかは要確認)
         elements.push( <blockquote key={`${startIndex}-tiktok`} className="tiktok-embed" cite={url} data-video-id={tiktokVideoId} style={{ maxWidth: '605px', minWidth: '325px' }}><section><a target="_blank" rel="noopener noreferrer" title="TikTok video" href={url} className="text-sky-400 hover:text-sky-300">TikTok 動画を読み込み中... {url}</a></section></blockquote> );
      } else {
        let href = url;
        if (href.toLowerCase().startsWith('www.')) { href = 'http://' + href; }
        if (!href.toLowerCase().startsWith('http')) { elements.push(<React.Fragment key={`text-${startIndex}`}>{url}</React.Fragment>); }
        else {
          // ★ 通常のリンク色を明るめに変更
          elements.push( <a key={`link-${startIndex}`} href={href} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 break-all">{url}</a> );
        }
      }
    }
    lastIndex = linkOrNewlineRegex.lastIndex;
  }

  if (lastIndex < limitedBody.length) {
    elements.push(<React.Fragment key={`text-${lastIndex}`}>{limitedBody.substring(lastIndex)}</React.Fragment>);
  }

  // ★ text-gray-800 を削除 (親から文字色を継承)
  return ( <div className="text-sm whitespace-pre-wrap break-words space-y-2">{elements}</div> );
}
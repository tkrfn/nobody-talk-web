// src/components/ClickableBody.tsx (新規作成)
'use client'; // Client Component (内部で特別な処理は少ないが念のため)

import React from 'react';

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
const embedDomains = ['youtube.com', 'youtu.be', 'twitter.com', 'x.com', 'tiktok.com'];

// --- Component Props ---
interface Props {
  body: string | null | undefined;
  charLimit?: number; // 文字数制限 (スレッド本体でのみ使用想定)
}

// --- Component ---
export default function ClickableBody({ body, charLimit }: Props) {
  if (!body) {
    return <div className="text-sm text-gray-800 whitespace-pre-wrap break-words mb-2"></div>;
  }

  // 文字数制限 (charLimit が指定された場合のみ適用)
  const limitedBody = (charLimit && body.length > charLimit) ? body.slice(0, charLimit) + '...' : body;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  linkOrNewlineRegex.lastIndex = 0; // 正規表現のインデックスをリセット

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
        elements.push( <blockquote key={`${startIndex}-tweet`} className="twitter-tweet" data-theme="light" data-dnt="true"><a href={url}>ツイートを読み込み中... {url}</a></blockquote> );
      } else if (tiktokVideoId) {
         elements.push( <blockquote key={`${startIndex}-tiktok`} className="tiktok-embed" cite={url} data-video-id={tiktokVideoId} style={{ maxWidth: '605px', minWidth: '325px' }}><section><a target="_blank" rel="noopener noreferrer" title="TikTok video" href={url}>TikTok 動画を読み込み中... {url}</a></section></blockquote> );
      } else {
        let href = url;
        if (href.toLowerCase().startsWith('www.')) { href = 'http://' + href; }
        if (!href.toLowerCase().startsWith('http')) { elements.push(<React.Fragment key={`text-${startIndex}`}>{url}</React.Fragment>); }
        else { elements.push( <a key={`link-${startIndex}`} href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{url}</a> ); }
      }
    }
    lastIndex = linkOrNewlineRegex.lastIndex;
  }

  if (lastIndex < limitedBody.length) {
    elements.push(<React.Fragment key={`text-${lastIndex}`}>{limitedBody.substring(lastIndex)}</React.Fragment>);
  }

  // space-y-2 は blockquote や iframe の間隔調整用
  return ( <div className="text-sm text-gray-800 whitespace-pre-wrap break-words space-y-2">{elements}</div> );
}
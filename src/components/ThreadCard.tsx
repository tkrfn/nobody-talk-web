// src/components/ThreadCard.tsx (修正版 - 詳細画像コンテナ中央揃え)
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

// Props の型定義 (変更なし)
interface ThreadCardProps {
  thread: {
    id: string;
    title: string;
    body: string | null | undefined;
    author_name?: string;
    created_at: string;
    image_url?: string | null;
  };
  isDetailPage?: boolean;
}

// ClickableBody ヘルパーコンポーネント (変更なし)
function ClickableBody({ body, charLimit = 1000 }: { body: string | null | undefined, charLimit?: number }) {
    if (!body) { return <p className="text-sm text-gray-600 mb-2"></p>; }
    const urlRegex = /((?:https?:\/\/|ftp:\/\/|www\.)[^\s<>"]+|www\.[^\s<>"]+)/gi;
    const limitedBody = body.length > charLimit ? body.slice(0, charLimit) + '...' : body;
    const parts = limitedBody.split(urlRegex);
    return (
      <p className="text-sm text-gray-800 whitespace-pre-wrap break-words mb-2">
        {parts.map((part, index) => {
          if (part && part.match(urlRegex)) {
            let href = part;
            if (href.toLowerCase().startsWith('www.')) { href = 'http://' + href; }
            if (!href.toLowerCase().startsWith('http')) { return <React.Fragment key={index}>{part}</React.Fragment>; }
            return ( <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{part}</a> );
          } else { return <React.Fragment key={index}>{part}</React.Fragment>; }
        })}
      </p>
    );
}

// ThreadCard コンポーネント本体
export default function ThreadCard({ thread, isDetailPage = false }: ThreadCardProps) {
  const Container = isDetailPage ? 'div' : Link;
  const containerProps = isDetailPage ? {} : { href: `/thread/${thread.id}` };

  return (
    <Container
      {...containerProps}
      className={`p-4 bg-white rounded-2xl shadow border border-card-border transition ${
        isDetailPage ? 'block' : 'hover:shadow-md flex items-center gap-3 p-3 rounded-xl'
      }`}
    >
      {/* --- 画像表示部分 --- */}
      {thread.image_url && (
        // ▼▼▼ 詳細ページの画像コンテナに flex + 中央揃え を追加 ▼▼▼
        <div className={`relative flex-shrink-0 ${
            isDetailPage ? 'w-[100px] h-[100px] mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center' : 'w-12 h-12' // ★ flex items-center justify-center 追加
        }`}>
        {/* ▲▲▲ スタイル追加 ▲▲▲ */}
          {isDetailPage ? (
            // 【詳細ページ画像】object-contain (変更なし)
            <Image
              src={thread.image_url}
              alt="スレッド画像"
              fill
              className="object-contain"
              sizes="100px"
              priority={true}
            />
          ) : (
            // 【一覧ページ画像】(変更なし)
            <Image
              src={thread.image_url}
              alt="スレッド画像"
              fill
              className="object-contain rounded-md bg-gray-100"
              sizes="48px"
              priority={false}
            />
          )}
        </div>
      )}
      {/* --- テキスト部分 --- */}
      <div className={`flex flex-col justify-between min-w-0 ${!isDetailPage ? 'flex-grow' : ''}`}>
         {/* ... (テキスト部分の残りは変更なし) ... */}
         <div>
          <h2 className={`text-lg font-semibold mb-1 ${!isDetailPage ? 'truncate' : ''}`}>{thread.title}</h2>
          {isDetailPage ? (
            <ClickableBody body={thread.body} charLimit={1000} />
          ) : (
            null
          )}
        </div>
        {isDetailPage ? (
            <div className="mt-1 text-xs text-gray-500 flex items-center justify-between">
              <span>👤 {thread.author_name || '匿名さん'}</span>
              <time dateTime={thread.created_at}>
                {new Date(thread.created_at).toLocaleString('ja-JP', { dateStyle: 'short', timeStyle: 'short' })}
              </time>
            </div>
        ) : (
             <div className="mt-0 text-xs text-gray-500 flex items-center">
                 <span>👤 {thread.author_name || '匿名さん'}</span>
                 <span className="mx-1">·</span>
                 <time dateTime={thread.created_at}>
                     {new Date(thread.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' })}
                 </time>
             </div>
        )}
      </div>
    </Container>
  );
}
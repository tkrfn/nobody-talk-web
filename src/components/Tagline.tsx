// src/components/Tagline.tsx
import Link from 'next/link';

export default function Tagline() {
  return (
    // ▼▼▼ className に border と border-card-border を追加 ▼▼▼
    <div className="bg-white rounded-lg shadow p-4 text-center mb-4 border border-card-border">
    {/* ▲▲▲ ここに追加 ▲▲▲ */}
      <span className="text-[18px] text-gray-800 font-medium block mb-1 leading-tight">
        誰にも言えないことを、<br />
        ここで吐き出しましょう。
      </span>
      <span className="text-xs text-gray-600 block mt-1">
        <span className="text-red-600 font-medium">注意:投稿に対する誹謗中傷は厳禁です。<br /></span>
        利用規約は
        <Link href="/terms" className="text-blue-600 hover:underline font-semibold px-1">
          こちら
        </Link>
      </span>
    </div>
  );
}
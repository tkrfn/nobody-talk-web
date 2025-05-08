// src/app/contact/page.tsx (お問い合わせ情報表示ページ)
import { Metadata } from 'next';
import Link from 'next/link'; // 利用規約へのリンク用

export const metadata: Metadata = {
  title: 'お問い合わせ | 誰にも言えない話掲示板',
  description: '運営へのお問い合わせ、ご意見、ご要望、削除依頼などはこちらの連絡先へお願いします。',
};

export default function ContactPage() {
  // ★ ご自身のメールアドレスに置き換えてください ★
  const infoEmail = 'info@nobodytalk.xyz';
  const reportEmail = 'report@nobodytalk.xyz';

  return (
    // レイアウトは利用規約ページなどに合わせる
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-gray-200 text-center mb-8">お問い合わせ</h1>

      {/* 説明文と連絡先をカードで囲む */}
      <section className="space-y-4 p-6 bg-white rounded-lg shadow border border-gray-200">
        <p className="text-sm text-center">
          当サイトに関するご連絡は、内容に応じて以下のメールアドレスまでお送りください。
          <br />
          通常、数日以内に確認いたしますが、すべてのお問い合わせに返信をお約束するものではございません。
        </p>

        {/* 一般的なお問い合わせ */}
        <div className="pt-4 border-t border-gray-100">
          <h2 className="font-semibold text-lg mb-1">一般的なお問い合わせ</h2>
          <p className="text-sm mb-1">
            ご意見、ご感想、サイト機能に関するご質問、メディア掲載依頼などはこちらへ。
          </p>
          <a href={`mailto:${infoEmail}`} className="text-blue-600 hover:underline break-all">
            {infoEmail}
          </a>
        </div>

        {/* 通報・削除依頼 */}
        <div className="pt-4 border-t border-gray-100">
          <h2 className="font-semibold text-lg mb-1">通報・削除依頼</h2>
          <p className="text-sm mb-1">
            利用規約違反の投稿、権利侵害（プライバシー、著作権等）の報告、削除のご依頼はこちらへ。
          </p>
          {/* 利用規約へのリンクを追加 */}
          <p className="text-xs text-red-600 my-2 p-2 bg-red-50 border border-red-200 rounded">
            <strong>【重要】</strong> 削除依頼の際は、必ず <Link href="/terms#article-10" className="underline font-bold">利用規約第10条</Link> をご確認の上、**対象投稿のURL**（または投稿日時や内容など特定できる情報）と**具体的な削除理由**を明記してください。情報が不十分な場合、対応いたしかねる場合がございます。
          </p>
          <a href={`mailto:${reportEmail}`} className="text-blue-600 hover:underline break-all">
            {reportEmail}
          </a>
        </div>
      </section>
    </div>
  );
}
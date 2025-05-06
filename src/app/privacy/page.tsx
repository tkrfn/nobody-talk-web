// src/app/privacy/page.tsx
import { Metadata } from 'next'

// ページのメタデータ (タイトルなど)
export const metadata: Metadata = {
  title: 'プライバシーポリシー | 誰にも言えない話掲示板',
  description: '誰にも言えない話掲示板のプライバシーポリシーです。',
}

export default function PrivacyPolicyPage() {
  // 今日日付を取得 (例: 2025年5月2日)
  const today = new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
  });

  return (
    // 全体を囲む div (利用規約ページと同様のレイアウト)
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-center mb-8">プライバシーポリシー</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">はじめに</h2>
        <p>
          このプライバシーポリシー（以下、「本ポリシー」といいます。）は、「誰にも言えない話掲示板」（以下、「当サイト」といいます。）が提供する掲示板サービス（以下、「本サービス」といいます。）における、ユーザー情報の取扱いについて定めたものです。当サイトは、ユーザーのプライバシーと匿名性を尊重し、慎重に情報を取り扱います。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">1. 収集する情報</h2>
        <p>
          当サイトでは、本サービスの運営上、以下の情報を収集する場合があります。
        </p>
        <ul className="list-disc space-y-2 ml-6">
          <li>
            <strong>サーバーログ情報:</strong> ユーザーが本サービスにアクセスした際、IPアドレス、ブラウザの種類、アクセス日時などの情報がサーバーログとして一時的に記録されることがあります。これらの情報は、不正アクセスの検知、サーバー障害時の原因調査、利用状況の統計分析など、サービスの安定的な運営のために利用されますが、特定の個人を識別する目的では使用いたしません。
          </li>
          <li>
            <strong>ユーザーが投稿した情報:</strong> ユーザーが任意で投稿したテキスト（スレッドタイトル、本文、コメント）、およびアップロードした画像ファイル。これらの情報には、個人を特定できる情報（氏名、住所、電話番号、メールアドレスなど）を含めないよう、ユーザー自身で十分ご注意ください。当サイトは匿名での利用を前提としています。
          </li>
          <li>
            <strong>Cookie（クッキー）:</strong> 当サイトまたは当サイト上で利用する第三者サービス（広告配信サービスなど）が、利便性の向上や利用状況の分析、適切な広告表示のために Cookie を使用する場合があります。Cookie はユーザーのブラウザに保存される小さなファイルであり、個人を特定する情報は含まれません。ユーザーはブラウザの設定により Cookie の受け入れを拒否することができますが、その場合、本サービスの一部機能が利用できなくなる可能性があります。
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">2. 情報の利用目的</h2>
        <p>収集した情報は、以下の目的で利用いたします。</p>
        <ul className="list-disc space-y-2 ml-6">
          <li>本サービスの提供、運営、維持、改善のため。</li>
          <li>利用規約に違反する行為への対応、その他不正利用防止のため。</li>
          <li>サービスの利用状況に関する統計データを作成するため（個人を特定できない形式）。</li>
          <li>お問い合わせに対応するため（お問い合わせフォーム等を通じて連絡があった場合）。</li>
          <li>広告配信のため（第4条参照）。</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">3. 情報の第三者提供</h2>
        <p>
          当サイトは、以下の場合を除き、ユーザーの情報を第三者に提供または開示いたしません。
        </p>
        <ul className="list-disc space-y-2 ml-6">
          <li>法令に基づき開示が義務付けられる場合（裁判所、警察等の公的機関からの要請）。</li>
          <li>
            人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき。
          </li>
          <li>
            当サイトの運営に関わる業務の一部を委託する場合（例: サーバーホスティング、データベース管理）。この場合、委託先に対し、本ポリシーに従って適切に情報を取り扱うよう監督します。（当サイトは Vercel 及び Supabase のインフラを利用しています。）
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">4. 広告配信について</h2>
        <p>
          当サイトでは、運営資金確保のため、第三者配信の広告サービス（Google AdSense など）を利用する場合があります。これらの広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他のサイトへのアクセスに関する情報（Cookie を含むが、氏名、住所、メールアドレス、電話番号は含まれない）を使用することがあります。詳細については、各広告配信事業者のプライバシーポリシーをご確認ください。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">5. 投稿内容の管理と削除</h2>
        <p>
          投稿された内容の管理および削除については、別途定める利用規約（特に第4条、第10条）に従います。個人情報が含まれる等の理由で投稿の削除を希望される場合は、利用規約に定める手順に従って削除依頼を行ってください。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">6. セキュリティ</h2>
        <p>
          当サイトは、収集した情報の紛失、破壊、改ざん、漏洩等を防止するために、技術的な安全管理措置を講じるよう努めますが、インターネット上の情報送信における完全な安全性を保証するものではありません。ユーザー自身におかれましても、パスワードの適切な管理や個人情報の投稿を避けるなど、セキュリティにご留意ください。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">7. プライバシーポリシーの変更</h2>
        <p>
          当サイトは、法令の変更やサービスの変更に伴い、本ポリシーを改定することがあります。重要な変更を行う場合には、当サイト上にて告知いたします。変更後のプライバシーポリシーは、当サイト上に掲載された時点から効力を生じるものとします。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">8. お問い合わせ</h2>
        <p>
          本ポリシーに関するお問い合わせは、[ここにお問い合わせ方法を記載、例: お問い合わせフォームへのリンク] よりお願いいたします。
          {/* TODO: お問い合わせ方法へのリンクや情報を追記してください */}
        </p>
      </section>

      <p className="text-sm text-gray-600 mt-8">
        制定日: {today}
      </p>

      <div className="mt-12 p-4 border border-red-300 bg-red-50 rounded text-red-700 text-sm">
        <p className="font-bold">【免責事項】</p>
        <p>
          私は AI であり、法律の専門家ではありません。上記は一般的な情報に基づいたプライバシーポリシーの文言案であり、法的助言ではありません。必ずご自身の責任で内容を確認し、必要に応じて弁護士等の専門家にご相談ください。
        </p>
      </div>
    </div>
  )
}
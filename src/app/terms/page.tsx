// src/app/terms/page.tsx
import { Metadata } from 'next'

// ページのメタデータ (タイトルなど)
export const metadata: Metadata = {
  title: '利用規約 | 誰にも言えない話掲示板',
  description: '誰にも言えない話掲示板の利用規約です。',
}

export default function TermsPage() {
  return (
    // 全体を囲む div (レイアウトやパディングを調整)
    // max-w-2xl で読みやすい幅に、mx-auto で中央寄せ
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-center mb-8">利用規約</h1>

      <p>
        この利用規約（以下、「本規約」といいます。）は、「誰にも言えない話掲示板」（以下、「当サイト」といいます。）が提供する掲示板サービス（以下、「本サービス」といいます。）の利用条件を定めるものです。本サービスをご利用いただく方（以下、「ユーザー」といいます。）は、本規約に同意のうえ、本サービスをご利用ください。
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">第1条（適用）</h2>
        <p>
          本規約は、ユーザーと当サイト運営者との間の本サービスの利用に関わる一切の関係に適用されます。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">第2条（匿名性の尊重および情報の取扱い）</h2>
        <ol className="list-decimal space-y-2 ml-6">
          <li>
            当サイトは、ユーザーのプライバシーと匿名性を最重要視して運営されています。
          </li>
          <li>
            投稿時にIPアドレスやブラウザ情報がサーバー上に一時的に記録される場合がありますが、個人を特定する目的での利用は行いません。
          </li>
          <li>
            法令に基づく正式な請求があった場合を除き、第三者にこれらの情報を提供することはありません。
          </li>
          <li>
            投稿内容には個人が特定される情報を含めないようご注意ください。当サイトは匿名での情報共有を推奨しています。
          </li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">第3条（禁止事項）</h2>
        <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
        <ol className="list-decimal space-y-2 ml-6">
          <li>法令または公序良俗に違反する行為</li>
          <li>犯罪行為に関連する行為</li>
          <li>他のユーザーまたは第三者の権利・利益を侵害する行為</li>
          <li>誹謗中傷、差別的発言、または不快感を与える内容の投稿</li>
          <li>商業的な広告・宣伝・勧誘、またはスパム行為</li>
          <li>当サイトの運営を妨害するおそれのある行為</li>
          <li>その他、運営者が不適切と判断する行為</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">第4条（投稿内容の権利と管理）</h2>
        <ol className="list-decimal space-y-2 ml-6">
          <li>
            ユーザーが投稿した内容の著作権は、原則として投稿者本人に帰属します。
          </li>
          <li>
            ただし、当サイトはその投稿内容を無償で利用・表示・編集・再構成できる非独占的権利を有します。
          </li>
          <li>
            運営者は、投稿が本規約に違反していると判断した場合、予告なく投稿の削除・編集・非表示の措置を行うことがあります。
          </li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">第5条（広告・マネタイズに関する事項）</h2>
        <ol className="list-decimal space-y-2 ml-6">
          <li>
            当サイトは、運営継続のために広告（バナー広告、記事内広告、アフィリエイトリンクなど）を掲載することがあります。
          </li>
          <li>
            広告の内容は第三者（広告主等）によって提供されるものであり、当サイトはその正確性・内容に関して保証いたしません。
          </li>
          <li>
            広告収入等を含むマネタイズによって得られた利益は、当サイトの運営費・開発費・改善費等に充てられます。
          </li>
          <li>
            ユーザーが広告を通じて第三者サービスを利用したことによるトラブルや損害について、当サイトは一切の責任を負いません。
          </li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">第6条（免責事項）</h2>
        <ol className="list-decimal space-y-2 ml-6">
          <li>
            当サイトは、投稿された情報の正確性・完全性・有用性について保証しません。
          </li>
          <li>
            ユーザー間または第三者との間で発生したトラブルについて、当サイトは一切の責任を負いません。
          </li>
          <li>
            本サービスの提供の中断・停止・変更等により生じた損害についても、当サイトは責任を負いません。
          </li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">第7条（サービスの変更・終了）</h2>
        <p>
          当サイトは、ユーザーへの事前の通知なしに本サービスの内容の変更または提供の中止を行うことがあります。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">第8条（利用規約の変更）</h2>
        <p>
          当サイトは、必要と判断した場合には、ユーザーに通知することなく、本規約を変更することがあります。変更後の規約は、当サイト上に掲載された時点から効力を生じるものとします。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">第9条（準拠法および管轄裁判所）</h2>
        <p>
          本規約の解釈および適用に関しては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する地方裁判所を専属的合意管轄裁判所とします。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">第10条（削除依頼について）</h2>
        <ol className="list-decimal space-y-2 ml-6">
          <li>
            投稿内容が法令違反、誹謗中傷、プライバシー侵害、その他不適切であると考えられる場合、当サイトのお問い合わせページ記載のアドレスより削除依頼を行うことができます。
          </li>
          <li>
            削除依頼には、該当する投稿のURLまたはスクリーンショット、削除理由の記載が必要です。
          </li>
          <li>
            運営者は内容を確認し、必要に応じて投稿の削除・編集・非表示などの対応を行うものとします。ただし、対応の義務を保証するものではありません。
          </li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-2">第11条（AIによる投稿について）</h2>
        <ol className="list-decimal space-y-2 ml-6">
          <li>
            当サイトでは、AI（人工知能）を活用した投稿も一定の条件下で認めています。
          </li>
          <li>
            AIによる投稿は、実体験や感情を偽るような内容ではなく、明確に「参考情報」「例文」「生成テキスト」などの形であることが推奨されます。
          </li>
          <li>
            誤解や混乱を防ぐため、AIを利用して作成した内容である場合は、なるべく明示するようご協力をお願いします。
          </li>
          <li>
            明らかに自動生成されたスパム的投稿、虚偽情報、悪意ある利用が認められた場合には、該当投稿を削除し、利用制限の対象とすることがあります。
          </li>
        </ol>
      </section>

    </div>
  )
}
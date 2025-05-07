// src/components/LikeButton.tsx (initialCount 対応版)
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { FiThumbsUp } from 'react-icons/fi'

// ★ Propsの型インターフェースを定義
interface LikeButtonProps {
  commentId: string;
  initialCount?: number; // initialCount をオプショナルなプロパティとして追加
}

export default function LikeButton({ commentId, initialCount }: LikeButtonProps) { // ★ 型インターフェースを適用
  // ★ initialCount が渡されていればそれを初期値に、そうでなければ0を初期値とする
  const [count, setCount] = useState(initialCount !== undefined ? initialCount : 0);
  const [isLoading, setIsLoading] = useState(initialCount === undefined); // initialCountがなければローディング開始

  // 初期にカウントを取得 (initialCount が渡されていない場合のみ)
  useEffect(() => {
    // initialCount が渡されていれば、それを表示するのでフェッチ不要
    if (initialCount !== undefined) {
      setCount(initialCount); // 念のため再セット (useStateの初期値と重複するが害はない)
      setIsLoading(false); // ローディング完了
      return;
    }

    // initialCount がない場合はDBからフェッチ
    let isMounted = true; // アンマウント時のクリーンアップ用フラグ
    const fetchCount = async () => {
      setIsLoading(true);
      try {
        const { count: fetchedCount, error } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('comment_id', commentId);

        if (error) {
          throw error;
        }

        if (isMounted) {
          setCount(fetchedCount || 0);
        }
      } catch (error) {
        if (isMounted) {
          console.error('いいね数取得エラー:', error);
          // エラー時もカウントは0のままか、何らかのエラー表示をするかなど検討
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCount();

    return () => {
      isMounted = false; // コンポーネントがアンマウントされたらフラグをfalseに
    };
  }, [commentId, initialCount]); // ★ initialCount も依存配列に追加

  const handleClick = async () => {
    console.log('👍 いいねクリック:', commentId);
    // (handleClick内のロジックは既存のままでも良いが、楽観的更新などを検討しても良い)
    try {
      // ユーザーがいいね済みかチェック (重複いいねを防ぐ場合。ここでは省略)
      // const { data: existingLike, error: checkError } = await supabase
      //   .from('likes')
      //   .select('id')
      //   .eq('comment_id', commentId)
      //   .eq('user_id', (await supabase.auth.getUser()).data.user?.id) // RLSで対応するなら不要
      //   .maybeSingle();
      //
      // if (existingLike) {
      //   console.log('既にいいね済みです');
      //   // いいね解除ロジックをここに書くか、何もしない
      //   return;
      // }


      // 新規いいねを挿入
      // setCount(prevCount => prevCount + 1); // 楽観的更新
      const { error: insertError } = await supabase
        .from('likes')
        .insert({ comment_id: commentId }) // user_id はRLSまたはDBのデフォルトで設定される想定
        .select(); // select() をつけないと Supabase V2 ではエラーになることがある

      if (insertError) {
        console.error('いいねエラー:', insertError);
        // setCount(prevCount => prevCount - 1); // 楽観的更新のロールバック
        return;
      }

      // 挿入後にカウントを再取得 (より正確なカウントのため)
      // ただし、上記の楽観的更新で済ませるか、DBトリガーでコメントテーブルのlike_countを更新する方が効率的
      const { count: newCount, error: fetchError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('comment_id', commentId);

      if (fetchError) {
        console.error('いいね後のカウント再取得エラー:', fetchError);
      } else {
        setCount(newCount || 0);
      }

    } catch (err) {
      console.error('いいね click エラー:', err);
      // setCount(prevCount => prevCount - 1); // 楽観的更新のロールバック
    }
  };

  // ローディング中は何も表示しないか、スピナーなどを表示する (任意)
  // if (isLoading) {
  //   return <div className="flex items-center space-x-1 text-gray-400"><FiThumbsUp /><span>-</span></div>;
  // }

  return (
    <button
      onClick={handleClick}
      className="flex items-center space-x-1 text-gray-400 hover:text-pink-500 transition-colors duration-150" // hover時の色を調整
      disabled={isLoading} // ローディング中はボタンを無効化 (任意)
    >
      <FiThumbsUp className={isLoading ? 'animate-pulse' : ''} /> {/* ローディング中にアイコンを点滅 (任意) */}
      <span>{count}</span>
    </button>
  );
}
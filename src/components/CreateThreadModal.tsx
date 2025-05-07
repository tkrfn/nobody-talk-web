// /src/components/CreateThreadModal.tsx (no-explicit-any 修正版)
'use client'

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image';

interface Props {
  isOpen: boolean
  onClose: () => void
}

// エラーオブジェクトがmessageプロパティを持つことを期待する型 (再利用可能なので別ファイルに切り出しても良い)
interface ErrorWithMessage {
  message: string;
}

function hasMessage(err: unknown): err is ErrorWithMessage {
  return (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as ErrorWithMessage).message === 'string'
  );
}

export default function CreateThreadModal({ isOpen, onClose }: Props) {
  const router = useRouter()

  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!file) { setPreview(null); return }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  }
  const clearFile = () => setFile(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim().length > 50) {
      alert("タイトルは50文字以内で入力してください。");
      return;
    }
    if (!title.trim()) {
      alert("タイトルは必須です。");
      return;
    }
    if (!body.trim()) {
      alert("本文は必須です。");
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    let imageUrl: string | null = null;

    try {
      if (file) {
        console.log("Uploading file:", file.name, file.type);
        const ext = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('thread-images').upload(fileName, file, { contentType: file.type || 'application/octet-stream', upsert: false });
        if (uploadError) throw new Error(`ファイルのアップロードに失敗しました: ${uploadError.message}`);
        console.log("Upload successful:", uploadData);
        const { data: urlData } = supabase.storage.from('thread-images').getPublicUrl(uploadData.path);
        imageUrl = urlData?.publicUrl || uploadData.path;
        console.log("Image URL:", imageUrl);
      } else {
        const randomImages = ['/Random1.png', '/Random2.png', '/Random3.png', '/Random4.png'];
        imageUrl = randomImages[Math.floor(Math.random() * randomImages.length)];
        console.log("No file selected, using random local image:", imageUrl);
      }

      const authorNameToInsert = name.trim() || '誰にも言えないスレ主';

      console.log("Inserting into threads:", { title: title.trim(), author_name: authorNameToInsert, body: body.trim(), image_url: imageUrl });
      const { error: insertError } = await supabase.from('threads').insert({ title: title.trim(), author_name: authorNameToInsert, body: body.trim(), image_url: imageUrl });
      if (insertError) throw new Error(`データベースへの書き込みに失敗しました: ${insertError.message}`);

      console.log("投稿成功！");
      setTitle('');
      setName('');
      setBody('');
      setFile(null);
      onClose();
      router.refresh();

    } catch (error: unknown) {
      console.error("handleSubmit Error:", error);
      if (error instanceof Error) {
        alert(`エラーが発生しました。\n${error.message}`);
      } else if (hasMessage(error)) { // ★ カスタム型ガードを使用
        alert(`エラーが発生しました。\n${error.message}`);
      } else {
        alert(`予期せぬエラーが発生しました。`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md space-y-4 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white z-10"> × </button>
        <h2 className="text-xl font-semibold text-center text-white">新規スレッド作成</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="threadTitleModal" className="block mb-1 text-sm font-medium text-gray-200">
              スレッドタイトル<span className="text-red-500 text-xs ml-1">※必須</span>
            </label>
            <input
              id="threadTitleModal"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="スレッドのタイトルを入力 (50文字まで)"
              required
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-200">投稿者名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="誰にも言えないスレ主さん"
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-200">画像 (任意)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"/>
            {preview && (
              <div className="mt-2 relative inline-block">
                <Image src={preview} alt="preview" width={96} height={96} className="object-cover rounded"/>
                <button type="button" onClick={clearFile} className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs leading-none"> × </button>
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-200">
              本文<span className="text-red-500 text-xs ml-1">※必須</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="ここに本文を入力"
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white resize-none focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
           <button type="submit" disabled={submitting} className="w-full py-2 bg-pink-500 rounded-lg text-white hover:bg-pink-600 transition disabled:opacity-50">
            {submitting ? '投稿中…' : '投稿する'}
          </button>
        </form>
      </div>
    </div>
  )
}
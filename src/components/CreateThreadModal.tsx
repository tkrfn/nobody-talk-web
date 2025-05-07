// src/components/CreateThreadModal.tsx
'use client';

import {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateThreadModal({ isOpen, onClose }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /* 画像プレビュー */
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      /* 画像アップロード */
      let imageUrl: string | null = null;
      if (file) {
        const { data, error } = await supabase.storage
          .from('thread-images')
          .upload(`${Date.now()}_${file.name}`, file, {
            cacheControl: '3600',
            upsert: false,
          });
        if (error) throw error;
        imageUrl = supabase.storage
          .from('thread-images')
          .getPublicUrl(data.path).data.publicUrl;
      }

      const { error: insertError } = await supabase.from('threads').insert({
        title,
        body,
        author_name: name,
        image_url: imageUrl,
      });
      if (insertError) throw insertError;

      onClose();
      router.refresh();
    } catch (error: unknown) {
      console.error('handleSubmit Error:', error);
      const message =
        error instanceof Error ? error.message : '投稿に失敗しました。';
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl space-y-4 rounded-lg bg-white p-6 shadow-xl"
      >
        <input
          className="w-full rounded border p-2"
          placeholder="タイトル"
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="h-32 w-full resize-none rounded border p-2"
          placeholder="本文 (任意)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="名前 (任意)"
          maxLength={30}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="block w-full text-sm"
        />
        {preview && (
          <Image
            src={preview}
            alt="preview"
            width={300}
            height={200}
            className="mx-auto rounded"
          />
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2"
          >
            キャンセル
          </button>
          <button
            disabled={submitting}
            className="rounded bg-pink-500 px-4 py-2 text-white hover:bg-pink-600 disabled:opacity-50"
          >
            スレッドを投稿
          </button>
        </div>
      </form>
    </div>
  );
}

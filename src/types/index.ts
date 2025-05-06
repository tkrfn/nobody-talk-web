// src/types/index.ts

// スレッドデータの型
export interface Thread {
    id: string;
    created_at: string;
    title: string;
    body: string;              // ★ null 許容をやめる
    author_name: string;       // ★ null 許容と任意(?)をやめる
    image_url?: string | null; // 画像は任意・null許容のまま
    // 他に必要なカラムがあれば追加
  }
  
  // コメントデータの型
  export interface Comment {
    id: string;
    created_at: string;
    body: string;              // ★ null 許容をやめる
    thread_id: string;
    // 他に必要なカラムがあれば追加
  }
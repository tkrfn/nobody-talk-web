// tailwind.config.js (修正版 - card-border を追加)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // 現在お使いの content 設定
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // 以前に追加した可能性のある他の色設定はそのまま残してください
        // 例: surface: '#FFFFFF',

        // 既存の色定義
        'header-pink': '#FF8C8E',     // ヘッダー/フッター用のピンク色
        'background-cream': '#FFECDF', // 背景用のクリーム色

        // ▼▼▼ 新しい枠線用の色定義を追加 ▼▼▼
        'card-border': '#A77F64',    // ← カードの枠線用にこれを追加！
        // ▲▲▲ ここまで追加 ▲▲▲
      },
      // 以前に追加した可能性のある他の extend 設定 (例: borderRadius) はそのまま残してください
      // 例:
      // borderRadius: {
      //   full: '9999px',
      // },
    },
  },
  plugins: [
    // 現在お使いの plugins 設定をそのまま維持
  ],
}
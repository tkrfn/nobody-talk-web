// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ovubpstcrnwrzvvhlhph.supabase.co', // Supabase ホスト名 (これは残す)
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'placekitten.com', // placekitten ホスト名 (これも残す)
        port: '',
        pathname: '/**',
      },
      // ▼▼▼ この example.com の設定を追加 ▼▼▼
      {
        protocol: 'https', // httpsだと仮定
        hostname: 'example.com',
        port: '',
        pathname: '/**', // example.com のどのパスでも許可
      },
      // ▲▲▲ ここまで追加 ▲▲▲
    ],
  },
  // 他の設定...
}

module.exports = nextConfig

// --- もし next.config.mjs を使っている場合 ---
/** @type {import('next').NextConfig} */
/*
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ovubpstcrnwrzvvhlhph.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'placekitten.com',
        port: '',
        pathname: '/**',
      },
      { // ▼▼▼ この example.com の設定を追加 ▼▼▼
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      }, // ▲▲▲ ここまで追加 ▲▲▲
    ],
  },
};
export default nextConfig;
*/
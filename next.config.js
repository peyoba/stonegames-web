/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'aistone.org'], // 允许的图片域名
    unoptimized: process.env.NODE_ENV === 'production', // 在Cloudflare Pages上需要禁用图片优化
  },
  // 针对Cloudflare Pages的特殊配置
  output: 'standalone', // 独立输出模式，适合Cloudflare Pages
  // 环境变量配置
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://aistone.org',
  },
  // 国际化配置
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  // 安全配置
  poweredByHeader: false, // 移除X-Powered-By头
  // 增强缓存配置
  generateEtags: true,
  // 启用TypeScript类型检查
  typescript: {
    ignoreBuildErrors: false,
  },
  // 启用ESLint检查
  eslint: {
    ignoreDuringBuilds: false,
  },
  // 启用压缩
  compress: true,
  // 跨域配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig 
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 允许外部图片域名
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  // 忽略TypeScript类型检查错误，仅在开发阶段使用
  typescript: {
    // 构建时忽略类型错误
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 
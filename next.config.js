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
}

module.exports = nextConfig 
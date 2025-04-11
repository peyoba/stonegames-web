import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/providers"

// 配置 Inter 字体
const inter = Inter({ subsets: ["latin"] })

// 网站元数据
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aistone.org'),
  title: {
    default: "Stone Games - 游戏导航网站",
    template: "%s | Stone Games"
  },
  description: "一个简单的游戏导航网站，提供各种有趣的网页游戏，让你轻松享受游戏乐趣。",
  keywords: ["游戏", "网页游戏", "在线游戏", "休闲游戏", "益智游戏", "动作游戏", "策略游戏", "多人游戏"],
  authors: [{ name: "Stone Games Team" }],
  creator: "Stone Games",
  publisher: "Stone Games",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: 'en_US',
    title: 'Stone Games - 游戏导航网站',
    description: '一个简单的游戏导航网站，提供各种有趣的网页游戏，让你轻松享受游戏乐趣。',
    siteName: 'Stone Games',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Stone Games - 游戏导航网站',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stone Games - 游戏导航网站',
    description: '一个简单的游戏导航网站，提供各种有趣的网页游戏，让你轻松享受游戏乐趣。',
    images: ['/images/twitter-image.png'],
    creator: '@stonegames',
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'zh-CN': '/zh-CN',
    },
  },
}

// 添加 viewport 配置
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

/**
 * 根布局组件
 * 包含全局样式和 Providers
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
} 
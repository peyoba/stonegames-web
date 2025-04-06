import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/providers"

// 配置 Inter 字体
const inter = Inter({ subsets: ["latin"] })

// 网站元数据
export const metadata: Metadata = {
  title: "Stone Games - 游戏导航网站",
  description: "一个简单的游戏导航网站，提供各种有趣的网页游戏。",
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
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
} 
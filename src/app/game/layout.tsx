"use client"

import { RootLayout } from "@/components/layout/root-layout"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

/**
 * 游戏页面布局组件
 * @param props.children - 子组件
 * @returns 游戏页面布局组件
 */
export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </RootLayout>
  )
} 
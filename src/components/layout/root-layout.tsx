"use client"

import { type PropsWithChildren } from "react"
import { useAppStore } from "@/store"
import { cn } from "@/lib/utils"

/**
 * 根布局组件
 * 提供基本的页面结构和主题支持
 */
export function RootLayout({ children }: PropsWithChildren) {
  // 获取主题设置
  const theme = useAppStore((state) => state.theme)

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground",
        // 根据主题设置背景色
        theme === "dark" && "dark"
      )}
    >
      {/* 页面内容 */}
      <div className="relative flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  )
} 
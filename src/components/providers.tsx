"use client"

import { ThemeProvider } from "next-themes"

/**
 * 客户端提供者组件
 * 包含主题提供者
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
} 
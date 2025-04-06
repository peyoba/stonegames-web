"use client"

/**
 * 客户端提供者组件
 * 空的提供者组件，移除了SessionProvider以避免冲突
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 
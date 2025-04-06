import { useAppStore } from "@/store"

/**
 * 加载组件
 * 用于显示加载状态
 */
export function Loading() {
  // 获取加载状态
  const isLoading = useAppStore((state) => state.isLoading)

  // 如果没有加载，不显示组件
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        {/* 加载动画 */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
} 
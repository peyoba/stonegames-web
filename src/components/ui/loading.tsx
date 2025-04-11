import { useAppStore } from "@/store"

/**
 * 加载组件
 * 用于显示加载状态
 */
export function Loading() {
  // 从 store 中获取 loading 状态
  const { loading } = useAppStore()
  
  // 如果不处于加载状态，不显示加载动画
  if (!loading) return null
  
  // 显示加载动画
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
} 
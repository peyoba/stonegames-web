import { create } from "zustand"
import { persist } from "zustand/middleware"
import { i18n } from '@/config/i18n'

// 应用状态接口
interface AppState {
  // 语言设置
  locale: string
  setLocale: (locale: string) => void

  // 主题设置
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void

  // 侧边栏状态
  isSidebarOpen: boolean
  toggleSidebar: () => void

  // 加载状态
  loading: boolean
  setLoading: (loading: boolean) => void

  // 错误消息
  error: string | null
  setError: (error: string | null) => void

  // 成功消息
  success: string | null
  setSuccess: (success: string | null) => void
}

// 创建应用状态store
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // 语言设置
      locale: i18n.defaultLocale,
      setLocale: (locale) => set({ locale }),

      // 主题设置
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      // 侧边栏状态
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      // 加载状态
      loading: false,
      setLoading: (loading) => set({ loading }),

      // 错误消息
      error: null,
      setError: (error) => set({ error }),

      // 成功消息
      success: null,
      setSuccess: (success) => set({ success }),
    }),
    {
      name: "app-storage", // 持久化存储的键名
      partialize: (state) => ({
        locale: state.locale,
        theme: state.theme,
        isSidebarOpen: state.isSidebarOpen,
      }), // 只持久化这些状态
    }
  )
) 
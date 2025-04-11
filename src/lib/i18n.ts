import { messages } from '@/config/i18n'
import { useAppStore } from '@/store'

// 定义支持的语言类型
type SupportedLocale = 'zh-CN' | 'en-US'

// 定义消息命名空间类型
type MessageNamespace = 'common' | 'game' | 'admin'

/**
 * 将实际语言代码转换为系统支持的语言代码
 * @param locale 当前语言代码
 * @returns 系统支持的语言代码
 */
function getNormalizedLocale(locale: string): SupportedLocale {
  // 如果包含'zh'，使用中文
  if (locale.includes('zh')) {
    return 'zh-CN'
  }
  // 其他情况使用英文
  return 'en-US'
}

/**
 * 获取当前语言的消息
 * @param namespace 消息命名空间
 * @returns 翻译函数
 */
export function useTranslation(namespace: MessageNamespace = 'common') {
  const locale = useAppStore((state) => state.locale)
  const normalizedLocale = getNormalizedLocale(locale)
  
  return (key: string): string => {
    const translations = messages[normalizedLocale]?.[namespace]
    if (translations && typeof translations === 'object' && key in translations) {
      return translations[key as keyof typeof translations]
    }
    return key
  }
}

/**
 * 格式化消息
 * @param text 消息文本
 * @param params 参数对象
 * @returns 格式化后的消息
 */
export function formatMessage(text: string, params: Record<string, string | number> = {}) {
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    text
  )
}

/**
 * 获取当前语言
 * @returns 当前语言代码
 */
export function useLocale() {
  return useAppStore((state) => state.locale)
}

/**
 * 设置当前语言
 * @param locale 语言代码
 */
export function useSetLocale() {
  return useAppStore((state) => state.setLocale)
} 
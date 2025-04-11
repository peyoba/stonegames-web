import * as icons from "lucide-react"
import { cn } from "@/lib/utils"
import { HelpCircle } from "lucide-react" // 导入默认图标

// 图标组件属性
interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string
  size?: number | string
  color?: string
}

/**
 * 动态图标组件
 * 根据名称渲染 Lucide 图标
 */
export const Icon = ({
  name,
  size = 16,
  color,
  className,
  ...props
}: IconProps) => {
  // @ts-ignore - 动态导入 Lucide 图标
  const IconComponent = icons[name]

  // 检查 IconComponent 是否是有效的 React 组件类型
  if (typeof IconComponent !== "function" && typeof IconComponent !== "object") {
    console.warn(`Icon component not found for name: ${name}, rendering default icon.`)
    // 如果找不到或类型无效，渲染默认图标
    return (
      <span className={cn("inline-block", className)} style={{ color }} {...props}>
        <HelpCircle size={size} />
      </span>
    )
  }

  // 渲染找到的图标组件
  return (
    <span
      className={cn("inline-block", className)}
      style={{ color }}
      {...props}
    >
      <IconComponent size={size} />
    </span>
  )
} 
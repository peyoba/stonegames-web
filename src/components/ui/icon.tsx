import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import * as Icons from "lucide-react"

// 图标组件属性
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: keyof typeof Icons
  size?: number
}

/**
 * 图标组件
 * 用于显示各种图标
 */
const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ className, name, size = 24, ...props }, ref) => {
    const IconComponent = Icons[name]

    return (
      <span
        ref={ref}
        className={cn("inline-flex items-center justify-center", className)}
        {...props}
      >
        <IconComponent size={size} />
      </span>
    )
  }
)
Icon.displayName = "Icon"

export { Icon } 
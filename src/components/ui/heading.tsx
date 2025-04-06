import { forwardRef } from "react"
import { cn } from "@/lib/utils"

// 标题组件属性
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

/**
 * 标题组件
 * 用于显示不同级别的标题，支持自定义样式
 */
export function Heading({
  level = 1,
  className,
  children,
  ...props
}: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements

  const styles = {
    1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
    3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    4: "scroll-m-20 text-xl font-semibold tracking-tight",
    5: "scroll-m-20 text-lg font-semibold tracking-tight",
    6: "scroll-m-20 text-base font-semibold tracking-tight",
  }

  return (
    <Component
      className={cn(styles[level as keyof typeof styles], className)}
      {...props}
    >
      {children}
    </Component>
  )
} 
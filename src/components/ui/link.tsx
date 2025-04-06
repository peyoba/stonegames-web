import { forwardRef } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// 链接组件属性
export interface LinkProps extends React.ComponentProps<typeof Link> {
  href: string
  className?: string
}

/**
 * 链接组件
 * 用于显示链接
 */
const LinkComponent = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, href, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          "text-primary underline-offset-4 hover:underline",
          className
        )}
        {...props}
      />
    )
  }
)
LinkComponent.displayName = "Link"

export { LinkComponent as Link } 
import { cn } from "@/lib/utils"

interface PlaceholderImageProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
}

/**
 * 占位图片组件
 * 在图片加载前显示一个带有文字的占位区域
 */
export function PlaceholderImage({
  text,
  className,
  ...props
}: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-muted",
        className
      )}
      {...props}
    >
      {text && (
        <span className="text-lg font-medium text-muted-foreground">{text}</span>
      )}
    </div>
  )
} 
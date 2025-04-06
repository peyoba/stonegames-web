import { forwardRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// 图片组件属性
export interface ImageProps extends React.ComponentProps<typeof Image> {
  alt: string
  src: string
  width?: number
  height?: number
  className?: string
}

/**
 * 图片组件
 * 用于显示图片
 */
const ImageComponent = forwardRef<HTMLImageElement, ImageProps>(
  ({ className, alt, src, width, height, ...props }, ref) => {
    return (
      <Image
        ref={ref}
        alt={alt}
        src={src}
        width={width}
        height={height}
        className={cn("rounded-md object-cover", className)}
        {...props}
      />
    )
  }
)
ImageComponent.displayName = "Image"

export { ImageComponent as Image } 
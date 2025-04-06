import { forwardRef } from "react"
import { cn } from "@/lib/utils"

// 对话框组件属性
export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 对话框组件
 * 用于显示模态框
 */
const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
)
Dialog.displayName = "Dialog"

// 对话框内容组件属性
export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 对话框内容组件
 */
const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative w-full max-w-lg rounded-lg bg-background p-6 shadow-lg",
        className
      )}
      {...props}
    />
  )
)
DialogContent.displayName = "DialogContent"

// 对话框标题组件属性
export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * 对话框标题组件
 */
const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
)
DialogTitle.displayName = "DialogTitle"

// 对话框描述组件属性
export interface DialogDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * 对话框描述组件
 */
const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
)
DialogDescription.displayName = "DialogDescription"

// 对话框底部组件属性
export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 对话框底部组件
 */
const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mt-6 flex justify-end space-x-2", className)}
      {...props}
    />
  )
)
DialogFooter.displayName = "DialogFooter"

export {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} 
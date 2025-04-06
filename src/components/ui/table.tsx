import { forwardRef } from "react"
import { cn } from "@/lib/utils"

// 表格组件属性
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

/**
 * 表格组件
 * 用于展示数据
 */
const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
)
Table.displayName = "Table"

// 表格头部组件属性
export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

/**
 * 表格头部组件
 */
const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
  )
)
TableHeader.displayName = "TableHeader"

// 表格主体组件属性
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

/**
 * 表格主体组件
 */
const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
)
TableBody.displayName = "TableBody"

// 表格行组件属性
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

/**
 * 表格行组件
 */
const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = "TableRow"

// 表格头部单元格组件属性
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

/**
 * 表格头部单元格组件
 */
const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
)
TableHead.displayName = "TableHead"

// 表格单元格组件属性
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

/**
 * 表格单元格组件
 */
const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  )
)
TableCell.displayName = "TableCell"

// 表格标题组件属性
export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

/**
 * 表格标题组件
 */
const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
)
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} 
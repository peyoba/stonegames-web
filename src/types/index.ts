// 游戏类型
export interface Game {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  imageUrl: string
  gameUrl: string
  categoryId: string
  category: Category
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

// 分类类型
export interface Category {
  id: string
  name: string
  nameEn: string
  games: Game[]
  createdAt: Date
  updatedAt: Date
}

// 管理员类型
export interface Admin {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// 语言类型
export type Locale = "en" | "zh"

// 主题类型
export type Theme = "light" | "dark" | "system"

// 分页参数类型
export interface PaginationParams {
  page: number
  limit: number
  search?: string
  categoryId?: string
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
} 
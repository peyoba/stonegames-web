// 网站基本信息
export const siteConfig = {
  name: "Stone Games",
  description: "A simple game navigation website",
  url: "https://aistone.org",
  ogImage: "https://aistone.org/og.jpg",
  links: {
    github: "https://github.com/yourusername/stonegames-web",
  },
}

// 支持的语言
export const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
] as const

// 默认语言
export const defaultLocale = "en" as const

// 每页显示的游戏数量
export const GAMES_PER_PAGE = 12

// 图片上传配置
export const imageConfig = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  maxWidth: 1920,
  maxHeight: 1080,
}

// API路由
export const apiRoutes = {
  // 游戏相关
  games: "/api/games",
  game: (id: string) => `/api/games/${id}`,
  
  // 分类相关
  categories: "/api/categories",
  category: (id: string) => `/api/categories/${id}`,
  
  // 管理员相关
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    session: "/api/auth/session",
  },
}

// 导航菜单
export const navigation = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Games",
    href: "/games",
  },
  {
    name: "Categories",
    href: "/categories",
  },
]

// 管理员导航菜单
export const adminNavigation = [
  {
    name: "Dashboard",
    href: "/admin",
  },
  {
    name: "Games",
    href: "/admin/games",
  },
  {
    name: "Categories",
    href: "/admin/categories",
  },
  {
    name: "Settings",
    href: "/admin/settings",
  },
]

// 错误消息
export const errorMessages = {
  // 通用错误
  general: {
    unknown: "An unknown error occurred",
    notFound: "Resource not found",
    unauthorized: "Unauthorized access",
    forbidden: "Access forbidden",
  },
  
  // 表单错误
  form: {
    required: "This field is required",
    invalid: "Invalid input",
    tooLong: "Input is too long",
    tooShort: "Input is too short",
  },
  
  // 认证错误
  auth: {
    invalidCredentials: "Invalid email or password",
    sessionExpired: "Session expired",
    notAuthenticated: "Not authenticated",
  },
}

// 成功消息
export const successMessages = {
  // 通用成功
  general: {
    created: "Successfully created",
    updated: "Successfully updated",
    deleted: "Successfully deleted",
  },
  
  // 认证成功
  auth: {
    loggedIn: "Successfully logged in",
    loggedOut: "Successfully logged out",
  },
} 
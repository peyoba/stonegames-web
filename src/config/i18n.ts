// 国际化配置
export const i18n = {
  // 默认语言
  defaultLocale: 'zh-CN',
  // 支持的语言
  locales: ['zh-CN', 'en-US'],
  // 语言名称映射
  localeNames: {
    'zh-CN': '中文',
    'en-US': 'English',
  },
  // 语言切换路由前缀
  localePrefix: 'as-needed',
  // 语言检测策略
  localeDetection: true,
}

// 语言包
export const messages = {
  'zh-CN': {
    common: {
      loading: '加载中...',
      error: '发生错误',
      retry: '重试',
      back: '返回',
      home: '首页',
      games: '游戏',
      categories: '分类',
      search: '搜索',
      language: '语言',
    },
    game: {
      play: '开始游戏',
      description: '游戏描述',
      category: '游戏分类',
      views: '浏览次数',
      likes: '点赞数',
    },
    admin: {
      login: '登录',
      logout: '退出',
      dashboard: '仪表盘',
      settings: '设置',
      users: '用户管理',
    },
  },
  'en-US': {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      back: 'Back',
      home: 'Home',
      games: 'Games',
      categories: 'Categories',
      search: 'Search',
      language: 'Language',
    },
    game: {
      play: 'Play Game',
      description: 'Description',
      category: 'Category',
      views: 'Views',
      likes: 'Likes',
    },
    admin: {
      login: 'Login',
      logout: 'Logout',
      dashboard: 'Dashboard',
      settings: 'Settings',
      users: 'User Management',
    },
  },
} 
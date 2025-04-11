# Stone Games 游戏导航网站

![Stone Games Logo](public/images/logo.png)

Stone Games是一个简单的游戏导航网站，通过iframe方式嵌入各种网页游戏，为用户提供便捷的游戏发现和体验平台。网站默认提供英文界面，同时支持中文语言切换，便于全球用户访问。

## 功能特点

- 🎮 丰富的游戏分类和列表
- 🔍 游戏搜索和过滤功能
- 🌐 多语言支持 (英文/中文)
- 📱 响应式设计，适配各种设备
- 👍 游戏点赞和分享功能
- 🖼️ 游戏截图和详情展示
- 🔄 实时更新的游戏统计

## 技术栈

- **前端**: Next.js 14, Tailwind CSS, Shadcn/UI, Framer Motion
- **后端**: Next.js API Routes, MongoDB
- **部署**: Cloudflare Pages, Cloudflare DNS

## 快速开始

### 环境要求

- Node.js 18+
- MongoDB

### 安装

1. 克隆仓库
```bash
git clone https://github.com/peyoba/stonegames-web.git
cd stonegames-web
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，填写必要的环境变量
```

4. 运行开发服务器
```bash
npm run dev
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm run start
```

## 部署

详细的部署说明请参考 [部署指南](docs/deployment.md)。

## 项目结构

```
stonegames-web/
├── public/             # 静态资源
├── src/                # 源代码
│   ├── app/            # 页面和API路由
│   ├── components/     # 组件
│   ├── lib/            # 工具函数和库
│   ├── models/         # 数据模型
│   └── store/          # 状态管理
├── prisma/             # Prisma配置和迁移
├── docs/               # 文档
└── scripts/            # 脚本工具
```

## 开发指南

### 添加新游戏

请访问管理员界面 `/admin/games` 添加新游戏。需要提供以下信息：

- 游戏标题（中英文）
- 游戏描述（中英文）
- 游戏URL（iframe嵌入地址）
- 游戏分类
- 游戏图片

### 添加新分类

请访问管理员界面 `/admin/categories` 添加新分类。需要提供以下信息：

- 分类名称（中英文）
- 分类图标（可选）

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议！请先fork本仓库，创建功能分支，提交更改后发起Pull Request。

## 许可证

本项目采用 [MIT License](LICENSE) 许可。

## 联系方式

如有问题或建议，请通过以下方式联系我们：

- 网站: [aistone.org](https://aistone.org)
- 邮箱: contact@aistone.org

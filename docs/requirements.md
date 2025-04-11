## 组件交互与数据流

### 首页数据结构

首页从`/api/home`接口获取数据，返回的数据结构如下：

```json
{
  "categories": [
    {
      "id": "分类ID",
      "name": "分类名称（中文）",
      "nameEn": "分类名称（英文）",
      "count": 该分类下的游戏数量,
      "games": [
        {
          "id": "游戏ID",
          "title": "游戏标题（中文）",
          "titleEn": "游戏标题（英文）",
          "description": "游戏描述（中文）",
          "descriptionEn": "游戏描述（英文）",
          "imageUrl": "游戏图片URL",
          "gameUrl": "游戏地址",
          "categoryId": "分类ID",
          "category": {
            "id": "分类ID",
            "name": "分类名称（中文）",
            "nameEn": "分类名称（英文）"
          },
          "views": 浏览量,
          "likes": 点赞数
        }
      ]
    }
  ],
  "latestGames": [
    {
      "id": "游戏ID",
      "title": "游戏标题（中文）",
      "titleEn": "游戏标题（英文）",
      "description": "游戏描述（中文）",
      "descriptionEn": "游戏描述（英文）",
      "imageUrl": "游戏图片URL",
      "gameUrl": "游戏地址",
      "categoryId": "分类ID",
      "category": {
        "id": "分类ID",
        "name": "分类名称（中文）",
        "nameEn": "分类名称（英文）"
      },
      "views": 浏览量,
      "likes": 点赞数
    }
  ]
}
```

首页会显示所有分类和最新游戏列表。用户可以按分类筛选游戏，也可以通过搜索框搜索游戏。

### 管理后台

管理后台提供以下功能：

1. 游戏管理：添加、编辑、删除游戏
2. 分类管理：添加、编辑、删除分类
3. 网站设置：设置网站标题、描述等

管理员可以通过以下路径访问管理后台：

- 首页底部的管理员链接
- 直接访问 `/admin` 路径

默认管理员账号：
- 用户名：admin@stonegames.com
- 密码：admin123

### 数据库结构

项目使用MongoDB数据库，主要包含以下集合：

1. `games`：游戏集合
   - `_id`: ObjectId
   - `title`: 游戏标题（中文）
   - `titleEn`: 游戏标题（英文）
   - `description`: 游戏描述（中文）
   - `descriptionEn`: 游戏描述（英文）
   - `imageUrl`: 游戏图片URL
   - `gameUrl`: 游戏地址
   - `categoryId`: 分类ID
   - `isPublished`: 是否发布
   - `views`: 浏览量
   - `likes`: 点赞数
   - `createdAt`: 创建时间
   - `updatedAt`: 更新时间

2. `categories`：分类集合
   - `_id`: ObjectId
   - `name`: 分类名称（中文）
   - `nameEn`: 分类名称（英文）
   - `createdAt`: 创建时间
   - `updatedAt`: 更新时间 
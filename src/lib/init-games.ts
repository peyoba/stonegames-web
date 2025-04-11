import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

// 示例游戏数据
const sampleGames = [
  {
    _id: new ObjectId(), // 确保每个游戏有唯一的 ID
    title: '俄罗斯方块',
    titleEn: 'Tetris',
    description: '经典的方块消除游戏',
    descriptionEn: 'Classic block falling game',
    imageUrl: '/images/tetris.png', // 使用我们之前添加的占位图
    gameUrl: '/games/tetris', // 假设的游戏路径
    categoryId: null, // 稍后关联分类
    tags: ['经典', '益智'],
    tagsEn: ['Classic', 'Puzzle'],
    isPublished: true, // 确保游戏是已发布状态
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId(),
    title: '贪吃蛇',
    titleEn: 'Snake',
    description: '控制小蛇吃食物变长',
    descriptionEn: 'Control the snake to eat food and grow',
    imageUrl: '/images/snake.png',
    gameUrl: '/games/snake',
    categoryId: null,
    tags: ['经典', '休闲'],
    tagsEn: ['Classic', 'Casual'],
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId(),
    title: '2048',
    titleEn: '2048',
    description: '合并数字方块达到 2048',
    descriptionEn: 'Merge number tiles to reach 2048',
    imageUrl: '/images/2048.png',
    gameUrl: '/games/2048',
    categoryId: null,
    tags: ['益智', '数字'],
    tagsEn: ['Puzzle', 'Number'],
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
    {
    _id: new ObjectId(),
    title: '忍者必须死',
    titleEn: 'Ninja Must Die',
    description: '快节奏的忍者跑酷游戏',
    descriptionEn: 'Fast-paced ninja running game',
    imageUrl: '/images/ninja.png', // 使用我们之前添加的占位图
    gameUrl: '/games/ninja',
    categoryId: null,
    tags: ['动作', '跑酷'],
    tagsEn: ['Action', 'Parkour'],
    isPublished: true, // 确保游戏是已发布状态
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * 初始化示例游戏数据
 */
export async function initGames() {
  try {
    const { db } = await connectToDatabase();
    const gamesCollection = db.collection('games');
    const categoriesCollection = db.collection('categories');

    // 获取所有分类，用于关联游戏
    const categories = await categoriesCollection.find({}).toArray();
    if (categories.length === 0) {
      console.warn('无法初始化游戏，因为没有找到任何分类。请先初始化分类。');
      return;
    }

    console.log('开始检查并初始化示例游戏...');

    for (const gameData of sampleGames) {
      // 随机分配一个分类
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      gameData.categoryId = randomCategory._id;

      // 检查游戏是否已存在 (通过标题判断)
      const existingGame = await gamesCollection.findOne({ title: gameData.title });

      if (!existingGame) {
        await gamesCollection.insertOne(gameData);
        console.log(`示例游戏 "${gameData.title}" 已添加。`);
      } else {
        // 如果游戏已存在，可以选择更新它的状态或跳过
         await gamesCollection.updateOne(
           { _id: existingGame._id },
           { $set: { isPublished: true, updatedAt: new Date(), categoryId: gameData.categoryId, imageUrl: gameData.imageUrl, gameUrl: gameData.gameUrl } } // 确保它是发布的并更新信息
         );
         console.log(`示例游戏 "${gameData.title}" 已存在，已更新状态为已发布。`);
      }
    }
    console.log('示例游戏检查和初始化完成。');

  } catch (error) {
    console.error('初始化示例游戏失败:', error);
    // 这里可以选择抛出错误或者静默处理
    // throw new Error('初始化示例游戏失败');
  }
} 
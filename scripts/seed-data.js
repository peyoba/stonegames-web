/**
 * 数据库初始化脚本
 * 用于导入初始游戏和分类数据到MongoDB
 * 运行方式: node scripts/seed-data.js
 */

// 加载环境变量
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
const { Schema } = mongoose;

// 检查环境变量
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('请确保.env.local文件中包含MONGODB_URI环境变量');
  process.exit(1);
}

// 分类模型
const CategorySchema = new Schema({
  name: { type: String, required: true },
  nameEn: { type: String, required: true },
  icon: { type: String, default: '🎮' },
  count: { type: Number, default: 0 }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// 游戏模型
const GameSchema = new Schema({
  title: { type: String, required: true },
  titleEn: { type: String, required: true },
  description: { type: String, required: true },
  descriptionEn: { type: String, required: true },
  imageUrl: { type: String, required: true },
  screenshots: { type: [String], default: [] },
  gameUrl: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, required: true, ref: 'Category' },
  releaseDate: { type: String, default: new Date().toISOString().split('T')[0] },
  developer: { type: String, default: '未知开发者' },
  tags: { type: [String], default: [] },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
}, { timestamps: true });

const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);

// 连接MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('已连接到MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB连接失败:', error);
    return false;
  }
}

// 清空现有数据
async function clearData() {
  await Category.deleteMany({});
  await Game.deleteMany({});
  console.log('已清空现有数据');
}

// 创建初始数据
async function seedData() {
  try {
    // 连接数据库
    const connected = await connectToMongoDB();
    if (!connected) return;

    // 清空现有数据
    await clearData();

    // 创建分类
    const categories = await Category.insertMany([
      {
        name: '益智游戏',
        nameEn: 'Puzzle',
        icon: '🧩',
        count: 0
      },
      {
        name: '动作游戏',
        nameEn: 'Action',
        icon: '🎮',
        count: 0
      },
      {
        name: '策略游戏',
        nameEn: 'Strategy',
        icon: '🎲',
        count: 0
      },
      {
        name: '休闲游戏',
        nameEn: 'Casual',
        icon: '🏖️',
        count: 0
      },
      {
        name: '射击游戏',
        nameEn: 'Shooter',
        icon: '🔫',
        count: 0
      }
    ]);
    console.log(`已插入 ${categories.length} 条分类数据`);

    // 创建游戏
    const games = await Game.insertMany([
      {
        title: '2048',
        titleEn: '2048',
        description: '经典的数字益智游戏，合并相同数字方块，达到2048或更高。',
        descriptionEn: 'Classic number puzzle game, merge same number tiles to reach 2048 or higher.',
        imageUrl: 'https://play-lh.googleusercontent.com/YX-Gf-B5MfJSbj1n4vOHzgB4uoJVF0OQSgBXr-BtCaLf6R9NnzlKV8K1J7MZ9jBJ3g=w240-h480-rw',
        gameUrl: 'https://play2048.co/',
        categoryId: categories[0]._id,
        developer: 'Gabriele Cirulli',
        tags: ['数字', '益智', '单人']
      },
      {
        title: '贪吃蛇',
        titleEn: 'Snake',
        description: '控制蛇吃食物并不断变长，同时避免碰到自己或墙壁。',
        descriptionEn: 'Control a snake to eat food and grow while avoiding collision with yourself or walls.',
        imageUrl: 'https://cdn.sanity.io/images/55mm68d3/production/03ae49db5702ff8f8d9490588fc1374ed0613cc5-1200x630.jpg',
        gameUrl: 'https://playsnake.org/',
        categoryId: categories[1]._id,
        developer: 'Classic Game',
        tags: ['经典', '动作', '单人']
      },
      {
        title: '俄罗斯方块',
        titleEn: 'Tetris',
        description: '移动、旋转和放置不同形状的方块，完成行消除得分。',
        descriptionEn: 'Move, rotate and place blocks of different shapes to complete and clear lines for points.',
        imageUrl: 'https://cdn.sanity.io/images/55mm68d3/production/8d15ed8c9bee7a7b6d3c7fa0bde1c0fec0b65ceb-1200x630.jpg',
        gameUrl: 'https://tetris.com/play-tetris',
        categoryId: categories[0]._id,
        developer: 'Tetris',
        tags: ['经典', '益智', '单人']
      },
      {
        title: '跳跃忍者',
        titleEn: 'Jumping Ninja',
        description: '控制忍者角色跳跃，躲避障碍物并收集奖励。',
        descriptionEn: 'Control a ninja character to jump, dodge obstacles and collect rewards.',
        imageUrl: 'https://cdn.sanity.io/images/55mm68d3/production/1b2ecfd2d8fd8c25b1c72c054b57cb8b4cee0948-512x512.png',
        gameUrl: 'https://www.crazygames.com/game/ninja-jump',
        categoryId: categories[1]._id,
        developer: 'Crazy Games',
        tags: ['动作', '跳跃', '手机游戏']
      },
      {
        title: '怪物生存',
        titleEn: 'Monster Survivors',
        description: '在怪物世界中生存，收集资源并对抗怪物。',
        descriptionEn: 'Survive in a monster world, collect resources and fight against monsters.',
        imageUrl: 'https://cdn.sanity.io/images/55mm68d3/production/1b2ecfd2d8fd8c25b1c72c054b57cb8b4cee0948-512x512.png',
        gameUrl: 'https://www.crazygames.com/game/monster-survivors',
        categoryId: categories[2]._id,
        developer: 'Peyoba Games',
        tags: ['生存', '怪物生存', '策略']
      }
    ]);
    console.log(`已插入 ${games.length} 条游戏数据`);

    // 更新分类游戏计数
    for (const category of categories) {
      const count = await Game.countDocuments({ categoryId: category._id });
      await Category.updateOne({ _id: category._id }, { count });
    }

    console.log('数据库初始化完成');

    // 关闭连接
    await mongoose.connection.close();
    console.log('已关闭MongoDB连接');
  } catch (error) {
    console.error('初始化数据失败:', error);
    await mongoose.connection.close();
  }
}

// 执行数据初始化
seedData(); 
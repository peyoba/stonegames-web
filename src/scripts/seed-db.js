// 数据库种子脚本 - 初始化游戏和分类数据
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * 初始化数据库种子数据
 */
async function main() {
  console.log('开始初始化数据库...')

  // 创建游戏分类
  const puzzleCategory = await prisma.category.upsert({
    where: { id: '000000000000000000000001' }, // 指定一个固定ID便于更新
    update: {}, // 如果已存在则不更新
    create: {
      id: '000000000000000000000001',
      name: '益智游戏',
      nameEn: 'Puzzle Games',
      description: '锻炼大脑的游戏，包括数字、逻辑和解谜游戏',
      descriptionEn: 'Games that exercise your brain, including number, logic, and puzzle-solving games',
      icon: '🧩',
      published: true,
      order: 1
    }
  })

  const actionCategory = await prisma.category.upsert({
    where: { id: '000000000000000000000002' },
    update: {},
    create: {
      id: '000000000000000000000002',
      name: '动作游戏',
      nameEn: 'Action Games',
      description: '需要快速反应和良好手眼协调的游戏',
      descriptionEn: 'Games that require quick reflexes and good hand-eye coordination',
      icon: '🎮',
      published: true,
      order: 2
    }
  })

  console.log('分类创建成功:', puzzleCategory.name, actionCategory.name)

  // 创建游戏
  const game2048 = await prisma.game.upsert({
    where: { id: '000000000000000000000001' },
    update: {},
    create: {
      id: '000000000000000000000001',
      title: '2048',
      titleEn: '2048',
      description: '经典的数字拼图游戏，合并相同的数字来获得2048方块',
      descriptionEn: 'Classic number puzzle game, merge the same numbers to get the 2048 tile',
      imageUrl: '/images/2048.png',
      gameUrl: 'https://play2048.co/',
      published: true,
      categoryId: puzzleCategory.id,
      views: 0,
      likes: 0,
      tags: ['数字', '益智', '休闲']
    }
  })

  const snakeGame = await prisma.game.upsert({
    where: { id: '000000000000000000000002' },
    update: {},
    create: {
      id: '000000000000000000000002',
      title: '贪吃蛇',
      titleEn: 'Snake',
      description: '经典的贪吃蛇游戏，通过吃食物让蛇变长',
      descriptionEn: 'Classic snake game, eat food to make the snake longer',
      imageUrl: '/images/snake.png',
      gameUrl: 'https://playsnake.org/',
      published: true,
      categoryId: actionCategory.id,
      views: 0,
      likes: 0,
      tags: ['经典', '动作', '休闲']
    }
  })

  console.log('游戏创建成功:', game2048.title, snakeGame.title)
  console.log('数据库初始化完成!')
}

main()
  .catch(e => {
    console.error('初始化数据库失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
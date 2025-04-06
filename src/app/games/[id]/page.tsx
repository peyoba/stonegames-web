"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { useAppStore } from "@/store";
import { ArrowLeft, ArrowUpRight, Share, ThumbsUp } from "lucide-react";

// 游戏详情接口
interface GameDetails {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  longDescription?: string;
  longDescriptionEn?: string;
  imageUrl: string;
  screenshots: string[];
  gameUrl: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    nameEn: string;
  };
  releaseDate?: string;
  developer?: string;
  tags?: string[];
  likes?: number;
  views?: number;
}

// 模拟游戏详情数据
const mockGameDetails: Record<string, GameDetails> = {
  "1": {
    id: "1",
    title: "2048",
    titleEn: "2048",
    description: "经典的数字益智游戏",
    descriptionEn: "Classic number puzzle game",
    longDescription: "2048是一款益智类数字游戏，游戏规则非常简单：在一个4x4的网格上，通过上下左右滑动，将相同的数字合并，目标是得到一个数值为2048的方块。每次滑动后，会在空白处随机出现一个2或4，当无法移动时游戏结束。这款游戏考验策略思维和数学技巧，非常具有挑战性。",
    longDescriptionEn: "2048 is a puzzle game where you combine matching numbers to create larger ones. The goal is to reach the tile with the number 2048. After every move, a new tile with a value of 2 or 4 appears randomly on the board. When no more moves are possible, the game ends. This game tests your strategic thinking and mathematical skills, making it very challenging.",
    imageUrl: "/images/2048.png",
    screenshots: [
      "/images/2048_1.png", 
      "/images/2048_2.png", 
      "/images/2048_3.png"
    ],
    gameUrl: "https://play2048.co/",
    categoryId: "1",
    category: {
      id: "1",
      name: "益智游戏",
      nameEn: "Puzzle",
    },
    releaseDate: "2014-03-09",
    developer: "Gabriele Cirulli",
    tags: ["数字", "益智", "策略", "单人"],
    likes: 5423,
    views: 28976
  },
  "2": {
    id: "2",
    title: "贪吃蛇",
    titleEn: "Snake",
    description: "经典的贪吃蛇游戏",
    descriptionEn: "Classic snake game",
    longDescription: "贪吃蛇是一款经典街机游戏，玩家控制一条蛇在平面上移动。蛇会不断前进，玩家需要改变蛇的方向，以避免撞到墙壁或自己的身体。游戏中，蛇每吃一个食物就会变长，得分也会增加。随着蛇的长度增加，游戏的难度也会相应提高。这款简单但上瘾的游戏已经有几十年的历史，至今仍然受到玩家的喜爱。",
    longDescriptionEn: "Snake is a classic arcade game where players control a snake moving on a plane. The snake continuously moves forward, and players need to change its direction to avoid hitting walls or its own body. In the game, the snake grows longer and scores increase with each food eaten. As the snake's length increases, the game becomes more challenging. This simple but addictive game has a history of several decades and is still loved by players today.",
    imageUrl: "/images/snake.png",
    screenshots: [
      "/images/snake_1.png", 
      "/images/snake_2.png", 
      "/images/snake_3.png"
    ],
    gameUrl: "https://playsnake.org/",
    categoryId: "1",
    category: {
      id: "1",
      name: "益智游戏",
      nameEn: "Puzzle",
    },
    releaseDate: "1976-01-01",
    developer: "Unknown",
    tags: ["经典", "街机", "技巧", "单人"],
    likes: 4812,
    views: 26453
  },
  "3": {
    id: "3",
    title: "俄罗斯方块",
    titleEn: "Tetris",
    description: "经典的俄罗斯方块游戏",
    descriptionEn: "Classic tetris game",
    longDescription: "俄罗斯方块是一款风靡全球的经典游戏，由俄罗斯程序员Alexey Pajitnov于1984年发明。游戏中，各种形状的方块从屏幕顶部落下，玩家可以旋转和移动这些方块，目标是将它们排列成完整的水平线以消除方块。当方块堆积到屏幕顶部时，游戏结束。这款游戏简单易上手，但要真正掌握需要大量练习和技巧。",
    longDescriptionEn: "Tetris is a globally popular classic game invented by Russian programmer Alexey Pajitnov in 1984. In the game, various shaped blocks fall from the top of the screen, and players can rotate and move these blocks with the goal of arranging them into complete horizontal lines to eliminate blocks. The game ends when the blocks stack up to the top of the screen. This game is simple to learn but requires significant practice and skill to truly master.",
    imageUrl: "/images/tetris.png",
    screenshots: [
      "/images/tetris_1.png", 
      "/images/tetris_2.png", 
      "/images/tetris_3.png"
    ],
    gameUrl: "https://tetris.com/play-tetris",
    categoryId: "2",
    category: {
      id: "2",
      name: "动作游戏",
      nameEn: "Action",
    },
    releaseDate: "1984-06-06",
    developer: "Alexey Pajitnov",
    tags: ["经典", "方块", "策略", "单人"],
    likes: 6234,
    views: 32156
  },
  "4": {
    id: "4",
    title: "跳跃忍者",
    titleEn: "Jumping Ninja",
    description: "考验反应能力的跳跃游戏",
    descriptionEn: "Test your reaction in this jumping game",
    longDescription: "跳跃忍者是一款简单但极具挑战性的动作游戏。玩家控制一个忍者角色，通过点击或按空格键使忍者跳跃，目标是避开障碍物并收集金币。游戏难度会随着时间推移而增加，忍者的移动速度会变得越来越快。这款游戏考验玩家的反应能力和时机把握，是打发时间的绝佳选择。",
    longDescriptionEn: "Jumping Ninja is a simple yet challenging action game. Players control a ninja character, making them jump by clicking or pressing the space bar, with the goal of avoiding obstacles and collecting coins. The game's difficulty increases over time, with the ninja's movement speed becoming faster. This game tests players' reaction time and timing, making it a great choice for passing time.",
    imageUrl: "/images/ninja.png",
    screenshots: [
      "/images/ninja_1.png", 
      "/images/ninja_2.png", 
      "/images/ninja_3.png"
    ],
    gameUrl: "https://www.crazygames.com/game/ninja-jump",
    categoryId: "2",
    category: {
      id: "2",
      name: "动作游戏",
      nameEn: "Action",
    },
    releaseDate: "2018-03-15",
    developer: "Crazy Games",
    tags: ["忍者", "跳跃", "反应", "单人"],
    likes: 3856,
    views: 18932
  }
};

/**
 * 游戏详情页面
 */
export default function GameDetailsPage() {
  // 获取游戏ID
  const params = useParams();
  const id = params.id as string;

  // 状态管理
  const locale = useAppStore((state) => state.locale);
  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [liked, setLiked] = useState(false);

  // 获取游戏详情
  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true);
      try {
        // 检查ID是否有效
        if (!id || id === 'undefined' || id === 'null') {
          console.error('无效的游戏ID:', id);
          setError(true);
          setLoading(false);
          return;
        }

        console.log('开始获取游戏详情，ID:', id);
        
        // 尝试从API获取游戏详情
        const response = await fetch(`/api/games/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log('成功获取游戏详情:', data);
          setGame(data);
        } else {
          // API错误处理
          const errorText = await response.text();
          console.error('API返回错误:', response.status, errorText);
          
          // 使用模拟数据作为后备
          console.log('尝试使用模拟游戏详情数据');
          const mockGame = mockGameDetails[id];
          if (mockGame) {
            console.log('找到模拟游戏数据:', mockGame);
            setGame(mockGame);
          } else {
            console.error('未找到游戏数据，ID:', id);
            setError(true);
          }
        }
      } catch (error) {
        console.error('获取游戏详情失败:', error);
        // 使用模拟数据作为后备
        console.log('错误后尝试使用模拟游戏详情数据');
        const mockGame = mockGameDetails[id];
        if (mockGame) {
          console.log('找到模拟游戏数据:', mockGame);
          setGame(mockGame);
        } else {
          console.error('未找到游戏数据，ID:', id);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGameDetails();
    } else {
      console.error('没有提供游戏ID');
      setError(true);
      setLoading(false);
    }
  }, [id]);

  // 处理图片加载错误
  const handleImageError = (key: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  // 显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-semibold text-primary">
              {locale === "zh" ? "加载中..." : "Loading..."}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // 显示错误状态
  if (error || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <PlaceholderImage className="w-24 h-24 mx-auto text-red-500" />
            <h2 className="text-xl font-semibold text-red-500">
              {locale === "zh" ? "游戏不存在" : "Game Not Found"}
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              {locale === "zh"
                ? "抱歉，我们找不到您请求的游戏。它可能已被移除或链接错误。"
                : "Sorry, we couldn't find the game you requested. It may have been removed or the link is incorrect."}
            </p>
            <Link href="/">
              <Button variant="default" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {locale === "zh" ? "返回首页" : "Back to Home"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
      {/* 返回按钮 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {locale === "zh" ? "返回首页" : "Back to Home"}
            </Button>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 游戏标题和信息 */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {locale === "zh" ? game.title : game.titleEn}
                </h1>
                <div className="mt-2 flex items-center">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {locale === "zh" ? game.category.name : game.category.nameEn}
                  </span>
                  {game.developer && (
                    <span className="ml-2 text-sm text-gray-500">
                      {locale === "zh" ? "开发者: " : "Developer: "}
                      {game.developer}
                    </span>
                  )}
                  {game.releaseDate && (
                    <span className="ml-2 text-sm text-gray-500">
                      {locale === "zh" ? "发布: " : "Released: "}
                      {new Date(game.releaseDate).getFullYear()}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <a href={game.gameUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full md:w-auto">
                    {locale === "zh" ? "开始游戏" : "Play Game"}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Button
                  variant={liked ? "default" : "outline"}
                  size="icon"
                  onClick={() => setLiked(!liked)}
                  title={locale === "zh" ? "喜欢" : "Like"}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert(
                      locale === "zh"
                        ? "链接已复制到剪贴板"
                        : "Link copied to clipboard"
                    );
                  }}
                  title={locale === "zh" ? "分享" : "Share"}
                >
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 游戏预览 */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 主要预览 */}
            <div className="md:col-span-2">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {game.screenshots && game.screenshots.length > 0 && !imageErrors[`screenshot-${activeScreenshot}`] ? (
                  <img
                    src={game.screenshots[activeScreenshot]}
                    alt={locale === "zh" ? game.title : game.titleEn}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(`screenshot-${activeScreenshot}`)}
                  />
                ) : !imageErrors.mainImage ? (
                  <img
                    src={game.imageUrl}
                    alt={locale === "zh" ? game.title : game.titleEn}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError('mainImage')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PlaceholderImage className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* 缩略图 */}
              {game.screenshots && game.screenshots.length > 0 && (
                <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                  {game.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      className={`flex-none w-24 h-16 rounded-md overflow-hidden ${
                        activeScreenshot === index
                          ? "ring-2 ring-primary"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => setActiveScreenshot(index)}
                    >
                      {!imageErrors[`thumbnail-${index}`] ? (
                        <img
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(`thumbnail-${index}`)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-xs text-gray-400">
                            {index + 1}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 游戏详情 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {locale === "zh" ? "游戏介绍" : "Description"}
                </h2>
                <p className="text-gray-700">
                  {locale === "zh"
                    ? game.longDescription || game.description
                    : game.longDescriptionEn || game.descriptionEn}
                </p>
              </div>

              {game.tags && game.tags.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {locale === "zh" ? "标签" : "Tags"}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {locale === "zh" ? "统计信息" : "Stats"}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">
                      {locale === "zh" ? "游戏次数" : "Plays"}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {game.views?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">
                      {locale === "zh" ? "喜欢" : "Likes"}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {liked
                        ? (game.likes ? game.likes + 1 : 1).toLocaleString()
                        : (game.likes || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 相关游戏推荐 */}
          <div className="p-6 border-t">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {locale === "zh" ? "相关游戏" : "Related Games"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Object.values(mockGameDetails)
                .filter((g) => g.id !== game.id && g.categoryId === game.categoryId)
                .slice(0, 5)
                .map((relatedGame) => (
                  <Link
                    key={relatedGame.id}
                    href={`/games/${relatedGame.id}`}
                    className="block group"
                  >
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-2">
                      {!imageErrors[`related-${relatedGame.id}`] ? (
                        <img
                          src={relatedGame.imageUrl}
                          alt={
                            locale === "zh"
                              ? relatedGame.title
                              : relatedGame.titleEn
                          }
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={() =>
                            handleImageError(`related-${relatedGame.id}`)
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PlaceholderImage className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                      {locale === "zh"
                        ? relatedGame.title
                        : relatedGame.titleEn}
                    </h3>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 
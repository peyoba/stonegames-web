"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Footer } from "@/components/layout/footer";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { useAppStore } from "@/store";
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Share, 
  ThumbsUp, 
  Expand, 
  Minimize,
  Calendar,
  User,
  Tag,
  Eye,
  Maximize
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { Navbar } from "@/components/layout/navbar";

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
  category?: {
    id: string;
    name: string;
    nameEn: string;
    icon?: string;
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
  const router = useRouter();
  const id = params.id as string;

  // 状态管理
  const locale = useAppStore((state) => state.locale);
  const t = useTranslation();
  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [liked, setLiked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
          
          // 如果没有分类信息，尝试获取分类详情
          if (data.categoryId && !data.category) {
            try {
              const categoryResponse = await fetch(`/api/categories/${data.categoryId}`);
              if (categoryResponse.ok) {
                const categoryData = await categoryResponse.json();
                data.category = categoryData;
              }
            } catch (err) {
              console.error('获取分类详情失败:', err);
            }
          }
          
          setGame(data);
          
          // 增加游戏浏览次数
          try {
            fetch(`/api/games/${id}/view`, { method: 'POST' });
          } catch (err) {
            console.error('增加浏览次数失败:', err);
          }
        } else {
          // API错误处理
          const errorText = await response.text();
          console.error('API返回错误:', response.status, errorText);
          setError(true);
        }
      } catch (error) {
        console.error('获取游戏详情失败:', error);
        setError(true);
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
  
  // 处理点赞
  const handleLike = async () => {
    if (!game) return;
    
    setLiked(!liked);
    
    try {
      await fetch(`/api/games/${id}/like`, {
        method: 'POST',
      });
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };
  
  // 处理分享
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: locale === 'zh' ? game?.title : game?.titleEn,
        text: locale === 'zh' ? game?.description : game?.descriptionEn,
        url: window.location.href,
      });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert(locale === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard');
    }
  };

  // 切换全屏模式
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 判断当前语言是否为中文
  const isZhLocale = locale.includes('zh');

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
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-4">
              {locale === "zh" ? "游戏不存在" : "Game Not Found"}
            </h1>
            <p className="text-gray-600 mb-8">
              {locale === "zh"
                ? "抱歉，您查找的游戏不存在或已被删除。"
                : "Sorry, the game you are looking for does not exist or has been removed."}
            </p>
            <Button onClick={() => router.push('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {locale === "zh" ? "返回首页" : "Back to Home"}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 导航栏（非全屏模式时显示） */}
      {!isFullscreen && <Navbar />}
      
      {/* 主要内容 */}
      <main className={`flex-grow ${isFullscreen ? 'p-0' : 'p-4 md:p-8'}`}>
        <div className={`max-w-7xl mx-auto ${isFullscreen ? 'w-full h-screen' : ''}`}>
          {/* 游戏区域 - 全屏模式 */}
          {isFullscreen && (
            <div className="fixed inset-0 z-50 bg-background">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-semibold">
                    {locale === "zh" ? game.title : game.titleEn}
                  </h2>
                  <Button variant="outline" onClick={toggleFullscreen}>
                    <Minimize className="mr-2 h-4 w-4" />
                    {locale === "zh" ? "退出全屏" : "Exit Fullscreen"}
                  </Button>
                </div>
                <div className="flex-1">
                  <iframe
                    src={game.gameUrl}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* 主要内容 */}
          <div className="container mx-auto px-4 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 左侧：游戏信息 */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-video">
                    {!imageErrors['main'] ? (
                      <img
                        src={game.imageUrl}
                        alt={locale === "zh" ? game.title : game.titleEn}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError('main')}
                      />
                    ) : (
                      <PlaceholderImage className="w-full h-full" />
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-3xl font-bold">
                        {locale === "zh" ? game.title : game.titleEn}
                      </h1>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleLike}>
                          <ThumbsUp className={`h-4 w-4 mr-1 ${liked ? 'fill-current text-primary' : ''}`} />
                          {game.likes || 0}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleShare}>
                          <Share className="h-4 w-4 mr-1" />
                          {locale === "zh" ? "分享" : "Share"}
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">
                      {locale === "zh" ? game.description : game.descriptionEn}
                    </p>
                    
                    {/* 游戏元数据 */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {game.category && (
                        <div className="flex items-center text-sm">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary mr-3">
                            {game.category.icon || '🎮'}
                          </span>
                          <span>
                            {locale === "zh" ? game.category.name : game.category.nameEn}
                          </span>
                        </div>
                      )}
                      
                      {game.releaseDate && (
                        <div className="flex items-center text-sm">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary mr-3">
                            <Calendar className="h-4 w-4" />
                          </span>
                          <span>{game.releaseDate}</span>
                        </div>
                      )}
                      
                      {game.developer && (
                        <div className="flex items-center text-sm">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary mr-3">
                            <User className="h-4 w-4" />
                          </span>
                          <span>{game.developer}</span>
                        </div>
                      )}
                      
                      {game.views !== undefined && (
                        <div className="flex items-center text-sm">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary mr-3">
                            <Eye className="h-4 w-4" />
                          </span>
                          <span>{game.views} {locale === "zh" ? "次浏览" : "views"}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* 标签 */}
                    {game.tags && game.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {game.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center rounded-full bg-secondary/50 px-2.5 py-0.5 text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-center">
                      <Button 
                        size="lg" 
                        onClick={toggleFullscreen}
                        className="w-full md:w-auto"
                      >
                        <Expand className="mr-2 h-4 w-4" />
                        {locale === "zh" ? "开始游戏" : "Play Game"}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* 游戏详情和截图 */}
                <Tabs defaultValue="details" className="bg-card rounded-lg shadow-sm overflow-hidden">
                  <TabsList className="w-full border-b rounded-none p-0">
                    <TabsTrigger 
                      value="details" 
                      className="flex-1 rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                      {locale === "zh" ? "游戏详情" : "Game Details"}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="screenshots" 
                      className="flex-1 rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                      {locale === "zh" ? "游戏截图" : "Screenshots"}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="p-6">
                    <div className="prose max-w-none">
                      {locale === "zh" && game.longDescription && (
                        <div dangerouslySetInnerHTML={{ __html: game.longDescription.replace(/\n/g, '<br/>') }} />
                      )}
                      {locale === "en" && game.longDescriptionEn && (
                        <div dangerouslySetInnerHTML={{ __html: game.longDescriptionEn.replace(/\n/g, '<br/>') }} />
                      )}
                      {!(locale === "zh" ? game.longDescription : game.longDescriptionEn) && (
                        <p className="text-muted-foreground">
                          {locale === "zh" ? "暂无详细描述。" : "No detailed description available."}
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="screenshots" className="p-6">
                    {game.screenshots && game.screenshots.length > 0 ? (
                      <div className="space-y-4">
                        <div className="aspect-video bg-accent rounded-lg overflow-hidden">
                          {!imageErrors[`screenshot-${activeScreenshot}`] ? (
                            <img
                              src={game.screenshots[activeScreenshot]}
                              alt={`Screenshot ${activeScreenshot + 1}`}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(`screenshot-${activeScreenshot}`)}
                            />
                          ) : (
                            <PlaceholderImage className="w-full h-full" />
                          )}
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2">
                          {game.screenshots.map((screenshot, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveScreenshot(index)}
                              className={`aspect-video rounded-md overflow-hidden border-2 ${
                                index === activeScreenshot ? 'border-primary' : 'border-transparent'
                              }`}
                            >
                              {!imageErrors[`thumb-${index}`] ? (
                                <img
                                  src={screenshot}
                                  alt={`Thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={() => handleImageError(`thumb-${index}`)}
                                />
                              ) : (
                                <PlaceholderImage className="w-full h-full" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        {locale === "zh" ? "暂无游戏截图。" : "No screenshots available."}
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* 右侧：游戏预览 */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-semibold">
                      {locale === "zh" ? "游戏预览" : "Game Preview"}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className={`game-iframe relative ${isFullscreen ? 'w-full h-full' : 'aspect-video rounded-lg overflow-hidden shadow-lg'}`}>
                      {game.gameUrl ? (
                        <iframe
                          src={game.gameUrl}
                          title={locale === "zh" ? game.title : game.titleEn}
                          className="w-full h-full border-0"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100 p-8 text-center">
                          <p className="text-gray-500">
                            {locale === "zh" ? '游戏暂不可用，请稍后再试。' : 'Game is currently unavailable. Please try again later.'}
                          </p>
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="secondary" 
                      className="w-full" 
                      onClick={toggleFullscreen}
                    >
                      <Expand className="mr-2 h-4 w-4" />
                      {locale === "zh" ? "全屏游戏" : "Fullscreen"}
                    </Button>
                  </CardContent>
                </Card>
                
                {/* 同类型游戏推荐 */}
                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-semibold">
                      {locale === "zh" ? "你可能也喜欢" : "You May Also Like"}
                    </h3>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground text-sm">
                      {locale === "zh" 
                        ? "正在开发中，敬请期待..."
                        : "Coming soon..."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* 页脚（非全屏模式时显示） */}
      {!isFullscreen && <Footer />}
    </div>
  );
} 
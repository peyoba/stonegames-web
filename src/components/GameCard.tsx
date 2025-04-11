import { useAppStore } from "@/store";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, ThumbsUp, Play } from "lucide-react";

/**
 * 游戏卡片组件属性
 */
interface GameCardProps {
  game: {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    imageUrl: string;
    categoryId: string;
    category?: {
      id: string;
      name: string;
      nameEn: string;
      icon?: string;
    };
    tags?: string[];
    likes?: number;
    views?: number;
  };
}

/**
 * 游戏卡片组件
 * 显示游戏的基本信息，点击可跳转到游戏详情页
 */
export default function GameCard({ game }: GameCardProps) {
  const locale = useAppStore((state) => state.locale);
  const isZhLocale = locale.includes('zh');
  
  return (
    <Link href={`/games/${game.id}`}>
      <motion.div 
        className="group relative h-full overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* 图片容器 */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* 游戏图片 */}
          {game.imageUrl ? (
            <img 
              src={game.imageUrl} 
              alt={isZhLocale ? game.title : game.titleEn} 
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-3xl text-gray-400">🎮</span>
            </div>
          )}
          
          {/* 分类标签 */}
          {game.category && (
            <div className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {game.category.icon && <span className="mr-1">{game.category.icon}</span>}
              {isZhLocale ? game.category.name : game.category.nameEn}
            </div>
          )}
          
          {/* 播放按钮悬浮效果 */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
            <div className="rounded-full bg-white/90 p-3 shadow-lg transition-transform group-hover:scale-110">
              <Play className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        
        {/* 游戏信息 */}
        <div className="p-4">
          <h3 className="mb-1 truncate text-lg font-semibold text-gray-800">
            {isZhLocale ? game.title : game.titleEn}
          </h3>
          
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            {isZhLocale ? game.description : game.descriptionEn}
          </p>
          
          <div className="flex items-center justify-between">
            {/* 标签 */}
            <div className="flex flex-wrap gap-1">
              {game.tags && game.tags.length > 0 ? (
                <>
                  {game.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {tag}
                    </span>
                  ))}
                  {game.tags.length > 2 && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      +{game.tags.length - 2}
                    </span>
                  )}
                </>
              ) : null}
            </div>
            
            {/* 统计数据 */}
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              {game.views !== undefined && (
                <div className="flex items-center">
                  <Eye className="mr-1 h-3 w-3" />
                  {game.views}
                </div>
              )}
              
              {game.likes !== undefined && (
                <div className="flex items-center">
                  <ThumbsUp className="mr-1 h-3 w-3" />
                  {game.likes}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
} 
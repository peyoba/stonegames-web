import mongoose, { Schema, Document } from 'mongoose';

// 游戏文档接口
export interface IGame extends Document {
  title: string;
  description: string;
  imageUrl: string;
  screenshots: string[];
  gameUrl: string;
  categoryId: mongoose.Types.ObjectId | string;
  releaseDate: string;
  developer: string;
  tags: string[];
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

// 游戏模式定义
const GameSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  screenshots: { type: [String], default: [] },
  gameUrl: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, required: true, ref: 'Category' },
  releaseDate: { type: String, default: new Date().toISOString().split('T')[0] },
  developer: { type: String, default: '未知开发者' },
  tags: { type: [String], default: [] },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
}, { 
  timestamps: true 
});

// 导出模型
// 注意：避免在服务器组件中重复初始化模型
export default mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema); 
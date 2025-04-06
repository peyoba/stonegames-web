import mongoose, { Schema, Document } from 'mongoose';

// 分类文档接口
export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  nameEn: string;
  icon?: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

// 分类模式定义
const CategorySchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  nameEn: { type: String, required: true },
  icon: { type: String, default: '🎮' },
  count: { type: Number, default: 0 }
}, { 
  timestamps: true 
});

// 导出模型
// 注意：避免在服务器组件中重复初始化模型
export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema); 
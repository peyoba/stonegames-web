import React, { ReactNode } from 'react';

// 定义Alert组件的props类型
interface AlertProps {
  message?: string;
  type: 'error' | 'success';
  children?: ReactNode;
  className?: string;
}

// Alert组件
const Alert: React.FC<AlertProps> = ({ message, type, children, className }) => {
  const alertType = type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';

  return (
    <div className={`p-4 mb-4 rounded ${alertType} ${className}`} role="alert">
      <span className="font-medium">{type === 'error' ? '错误' : '成功'}: </span>
      {message || children}
    </div>
  );
};

export default Alert; 
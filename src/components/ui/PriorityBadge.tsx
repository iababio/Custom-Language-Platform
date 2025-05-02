import React from 'react';
import { Task } from '../../utils/types';

interface PriorityBadgeProps {
  priority: Task['priority'];
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const colorMap = {
    'Low': 'text-gray-600',
    'Normal': 'text-blue-600',
    'Urgent': 'text-red-600'
  };
  
  return (
    <div className={`flex items-center ${colorMap[priority]}`}>
      <span className="mr-1">↑</span>
      <span>{priority}</span>
    </div>
  );
};
import React from 'react';
import { Avatar } from './Avatar';

interface AvatarGroupProps {
  assignees: string[];
}

export const AvatarGroup = ({ assignees }: AvatarGroupProps) => {
  return (
    <div className="flex -space-x-2">
      {assignees.map((initials, index) => {
        const colors = [
          'bg-purple-500', 'bg-blue-500', 'bg-green-500', 
          'bg-yellow-500', 'bg-red-500', 'bg-pink-500'
        ];
        return (
          <Avatar 
            key={index} 
            initials={initials} 
            color={colors[index % colors.length]} 
          />
        );
      })}
    </div>
  );
};
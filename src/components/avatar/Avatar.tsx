import React from 'react';

interface AvatarProps {
  initials: string;
  color: string;
}

export const Avatar = ({ initials, color }: AvatarProps) => (
  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${color}`}>
    {initials}
  </div>
);
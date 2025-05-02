import React from 'react';

interface ProgressBarProps {
   progress: number;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => (
   <div className="w-32 bg-gray-200 rounded-full h-2">
      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
   </div>
);

import React from 'react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';
import { Task } from '../../utils/types';
import { AvatarGroup } from '../avatar/AvatarGroup';
import { PriorityBadge } from '../ui/PriorityBadge';
import { ProgressBar } from '../ui/ProgressBar';

interface TaskRowProps {
   task: Task;
}

export const TaskRow = ({ task }: TaskRowProps) => {
   return (
      <motion.tr
         className="border-b border-gray-100 hover:bg-gray-50"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
      >
         <td className="py-3 px-2">
            <div className="flex items-center">
               <input
                  type="checkbox"
                  checked={task.isChecked}
                  className="mr-2 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
               />
               <span>{task.title}</span>
               {task.subtasks && (
                  <span className="ml-2 text-xs text-gray-500">
                     {task.completedSubtasks || 0}/{task.subtasks}
                  </span>
               )}
            </div>
         </td>
         <td className="py-3 px-2 text-sm text-gray-600">{task.description || '-'}</td>
         <td className="py-3 px-2">
            <AvatarGroup assignees={task.assignees} />
         </td>
         <td className="py-3 px-2 text-sm">{task.dueDate}</td>
         <td className="py-3 px-2">
            <PriorityBadge priority={task.priority} />
         </td>
         <td className="py-3 px-2">
            <ProgressBar progress={task.progress} />
         </td>
         <td className="py-3 px-2 text-right">
            <button className="text-gray-500 hover:text-gray-700">
               <List size={16} />
            </button>
         </td>
      </motion.tr>
   );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { List, Plus } from 'lucide-react';
import { TaskGroup as TaskGroupType } from '../../utils/types';
import { TaskRow } from './TaskRow';

interface TaskGroupProps {
  group: TaskGroupType;
}

export const TaskGroup = ({ group }: TaskGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mr-2 text-gray-500"
        >
          {isExpanded ? '▼' : '►'}
        </button>
        <div 
          className={`w-3 h-3 rounded-full ${group.color} mr-2`}
        />
        <h3 className="font-medium">{group.title}</h3>
        <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {group.tasks.length}
        </span>
        <button className="ml-auto text-gray-500 hover:text-gray-700">
          <List size={16} />
        </button>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="py-2 px-2 font-medium">Task</th>
                <th className="py-2 px-2 font-medium">Description</th>
                <th className="py-2 px-2 font-medium">Assignee</th>
                <th className="py-2 px-2 font-medium">Due Date</th>
                <th className="py-2 px-2 font-medium">Priority</th>
                <th className="py-2 px-2 font-medium">Progress</th>
                <th className="py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {group.tasks.map(task => (
                <TaskRow key={task.id} task={task} />
              ))}
            </tbody>
          </table>
          
          <button className="mt-4 flex items-center text-gray-500 hover:text-gray-700 text-sm">
            <Plus size={16} className="mr-1" /> Add task
          </button>
        </motion.div>
      )}
    </div>
  );
};
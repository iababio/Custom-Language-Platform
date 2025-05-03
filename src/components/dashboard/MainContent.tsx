import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Grid, Plus, Search } from 'lucide-react';
import { TaskGroup as TaskGroupType } from '../../utils/types';
import { TaskGroup } from '../tasks/TaskGroup';

interface MainContentProps {
   activeTab: string;
   taskGroups: TaskGroupType[];
   setActiveTab: (tab: string) => void;
}

export const MainContent = ({ taskGroups, activeTab, setActiveTab }: MainContentProps) => {
   return (
      <main className="flex-1 overflow-y-auto bg-white">
         <div className="flex mt-6 mb-5 border-b border-gray-200">
            <button
               className={`px-4 py-2 flex items-center ${activeTab === 'spreadsheet' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
               onClick={() => setActiveTab('spreadsheet')}
            >
               <Grid size={16} className="mr-2" />
               <span>Spreadsheet</span>
            </button>
            <button
               className={`px-4 py-2 flex items-center ${activeTab === 'timeline' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
               onClick={() => setActiveTab('timeline')}
            >
               <Clock size={16} className="mr-2" />
               <span>Timeline</span>
            </button>
            <button
               className={`px-4 py-2 flex items-center ${activeTab === 'calendar' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
               onClick={() => setActiveTab('calendar')}
            >
               <Calendar size={16} className="mr-2" />
               <span>Calendar</span>
            </button>
            <button
               className={`px-4 py-2 flex items-center ${activeTab === 'board' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
               onClick={() => setActiveTab('board')}
            >
               <Grid size={16} className="mr-2" />
               <span>Board</span>
            </button>
            <button className="px-2 py-2 text-gray-600">
               <Plus size={16} />
            </button>
         </div>
         <div className="flex justify-between px-6 mb-6">
            <div className="relative">
               <Search size={16} className="absolute left-3 top-3 text-gray-400" />
               <input
                  type="text"
                  placeholder="Search task..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               />
            </div>
            <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
               <span>Filter</span>
            </button>
         </div>

         {/* Task lists */}
         <motion.div
            className="px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
         >
            {taskGroups.map((group) => (
               <TaskGroup key={group.id} group={group} />
            ))}
         </motion.div>
      </main>
   );
};

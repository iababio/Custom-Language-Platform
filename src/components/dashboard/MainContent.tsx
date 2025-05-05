import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Grid, Plus, Search } from 'lucide-react';
import { TaskGroup } from '../tasks/TaskGroup';
import { UploadData } from './UploadData';
import { useDashboard } from '../../contexts/DashboardContext';

interface MainContentProps {
   activePage: string;
}

export const MainContent = ({ activePage }: MainContentProps) => {
   const { taskGroups, activeTab, setActiveTab } = useDashboard();

   // Render appropriate content based on the active page from sidebar
   const renderPageContent = () => {
      switch (activePage) {
         case 'training':
            return (
               <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Training</h2>
                  <p>Training module content goes here</p>
               </div>
            );
         case 'logs':
            return (
               <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Logs</h2>
                  <p>System logs and monitoring information</p>
               </div>
            );
         case 'evaluate':
            return (
               <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Evaluate & Chat</h2>
                  <p>Model evaluation and chat interface</p>
               </div>
            );
         case 'todo':
            return (
               <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">To Do</h2>
                  <p>Task management interface</p>
               </div>
            );
         case 'favorites':
            return (
               <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Favorites</h2>
                  <p>Favorite tasks and items</p>
               </div>
            );
         case 'uploads':
            return (
               <div className="p-6">
                  <UploadData />
               </div>
            );
         case 'labeling':
         case 'labels':
            return (
               <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Labels</h2>
                  <p>Label management interface</p>
               </div>
            );
         case 'created':
            return (
               <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Labeling</h2>
                  <p>Labeling interface for tasks</p>
               </div>
            );
         default:
            // Default dashboard view with tasks
            return (
               <>
                  {/* Fixed header section */}
                  <div className="flex-shrink-0">
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
                           className={`px-4 py-2 flex items-center ${activeTab === 'upload' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                           onClick={() => setActiveTab('upload')}
                        >
                           <Grid size={16} className="mr-2" />
                           <span>Upload</span>
                        </button>
                        <button className="px-2 py-2 text-gray-600">
                           <Plus size={16} />
                        </button>
                     </div>

                     {activeTab !== 'upload' && (
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
                     )}
                  </div>

                  {/* Scrollable content section */}
                  {activeTab === 'upload' ? (
                     <div className="px-6 flex-1 overflow-y-auto">
                        <UploadData />
                     </div>
                  ) : (
                     <motion.div
                        className="px-6 flex-1 overflow-y-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                     >
                        {taskGroups.map((group) => (
                           <TaskGroup key={group.id} group={group} />
                        ))}
                     </motion.div>
                  )}
               </>
            );
      }
   };

   return (
      <main className="flex-1 flex flex-col overflow-hidden bg-white">{renderPageContent()}</main>
   );
};

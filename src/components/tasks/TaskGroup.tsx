import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskGroup as TaskGroupType } from '../../utils/types';
import { TaskRow } from './TaskRow';

interface TaskGroupProps {
   group: TaskGroupType;
}

export const TaskGroup = ({ group }: TaskGroupProps) => {
   const [currentPage, setCurrentPage] = useState(1);
   const tasksPerPage = 10; // You can adjust this number based on your needs

   // Calculate pagination values
   const indexOfLastTask = currentPage * tasksPerPage;
   const indexOfFirstTask = indexOfLastTask - tasksPerPage;
   const currentTasks = group.tasks.slice(indexOfFirstTask, indexOfLastTask);
   const totalPages = Math.ceil(group.tasks.length / tasksPerPage);

   const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
   };

   return (
      <div className="mb-8">
         <div className="mb-3 flex items-center">
            <div className={`w-3 h-3 ${group.color} rounded-full mr-2`}></div>
            <h2 className="text-lg font-medium">{group.title}</h2>
            <span className="ml-2 text-sm text-gray-500">
               ({group.tasks.length} {group.tasks.length === 1 ? 'item' : 'items'})
            </span>
         </div>
         <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
         >
            <table className="w-full">
               <thead>
                  <tr className="text-left text-sm text-gray-500">
                     <th className="py-2 px-2 font-medium">English</th>
                     <th className="py-2 px-2 font-medium">LRL</th>
                     <th className="py-2 px-2 font-medium text-center">IC-XCL</th>
                     <th className="py-2 px-2 font-medium">Edited By</th>
                     {/* <th className="py-2 px-2 font-medium">Priority</th> */}
                     <th className="py-2 px-2"></th>
                  </tr>
               </thead>
               <tbody>
                  {currentTasks.map((task) => (
                     <TaskRow key={task.id} task={task} />
                  ))}
               </tbody>
            </table>

            {/* Pagination controls */}
            {totalPages > 1 && (
               <div className="flex justify-between items-center mt-4 px-2">
                  <div className="text-sm text-gray-500">
                     Showing {indexOfFirstTask + 1}-{Math.min(indexOfLastTask, group.tasks.length)}{' '}
                     of {group.tasks.length}
                  </div>
                  <div className="flex space-x-2">
                     <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${
                           currentPage === 1
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                     >
                        Previous
                     </button>
                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                           key={page}
                           onClick={() => handlePageChange(page)}
                           className={`px-3 py-1 rounded ${
                              currentPage === page
                                 ? 'bg-blue-500 text-white'
                                 : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                           }`}
                        >
                           {page}
                        </button>
                     ))}
                     <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${
                           currentPage === totalPages
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                     >
                        Next
                     </button>
                  </div>
               </div>
            )}
         </motion.div>
      </div>
   );
};

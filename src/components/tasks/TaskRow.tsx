import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { List, Braces, X } from 'lucide-react';
import { Task } from '../../utils/types';
import { AvatarGroup } from '../avatar/AvatarGroup';
// import { PriorityBadge } from '../ui/PriorityBadge';

interface TaskRowProps {
   task: Task;
}

export const TaskRow = ({ task }: TaskRowProps) => {
   const [showXCLModal, setShowXCLModal] = useState(false);

   return (
      <>
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
                  <span>{task.english}</span>
                  {task.subtasks && (
                     <span className="ml-2 text-xs text-gray-500">
                        {task.completedSubtasks || 0}/{task.subtasks}
                     </span>
                  )}
               </div>
            </td>
            <td className="py-3 px-2 text-sm text-gray-600">{task.lrl || '-'}</td>
            <td className="py-3 px-2 text-center">
               <button
                  onClick={() => setShowXCLModal(true)}
                  className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-gray-200"
                  title="View/Edit IC-XCL data"
               >
                  <Braces size={16} className="text-gray-600" />
               </button>
            </td>
            <td className="py-3 px-2">
               <AvatarGroup assignees={task.assignees} />
            </td>
            {/* <td className="py-3 px-2">
               <PriorityBadge priority={task.priority} />
            </td> */}
            <td className="py-3 px-2 text-right">
               <button className="text-gray-500 hover:text-gray-700">
                  <List size={16} />
               </button>
            </td>
         </motion.tr>

         {/* XCL Edit Modal */}
         {showXCLModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-medium">IC-XCL Data</h3>
                     <button
                        onClick={() => setShowXCLModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <div className="mb-6">
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           English
                        </label>
                        <div className="p-3 bg-gray-50 rounded border border-gray-200">
                           {task.english}
                        </div>
                     </div>

                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">LRL</label>
                        <div className="p-3 bg-gray-50 rounded border border-gray-200">
                           {task.lrl}
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           IC-XCL
                        </label>
                        <textarea
                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           rows={4}
                           placeholder="Enter IC-XCL data here"
                           defaultValue=""
                        ></textarea>
                     </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                     <button
                        onClick={() => setShowXCLModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                     >
                        Cancel
                     </button>
                     <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Save
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

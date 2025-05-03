import React from 'react';
import { Home, CheckSquare, Clock, List, Plus, Star, Settings, File, Edit } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export const Sidebar = () => {
   const { user } = useUser();

   return (
      <div className="w-51 bg-gray-100 border-r border-gray-100 flex flex-col">
         <div className="px-4 py-3  border-gray-200 flex items-center">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white mr-2">
               A
            </div>
            <h1 className="font-semibold">Language Platform</h1>
         </div>

         <div className="px-4 py-2 border-gray-200">
            <div className="flex items-center justify-between">
               <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white mr-2">
                     K
                  </div>
                  <span>Training Datasets</span>
               </div>
               <button className="text-gray-400">
                  <List size={12} />
               </button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto">
            <ul className="p-2">
               <li className="mb-0">
                  <a
                     href="#"
                     className="flex items-center px-4 py-1 text-gray-700 rounded hover:bg-white"
                  >
                     <Home size={12} className="mr-3 text-gray-500" />
                     <span>QA Tests</span>
                  </a>
               </li>
               <li className="mb-0">
                  <a
                     href="#"
                     className="flex items-center px-4 py-1 text-gray-700 rounded hover:bg-bg-white"
                  >
                     <CheckSquare size={12} className="mr-3 text-gray-500" />
                     <span>ToDo</span>
                  </a>
               </li>
            </ul>

            <div className="p-4 border-t border-gray-200">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">Datasets</h3>
                  <div className="flex">
                     <button className="text-gray-400 mr-1">
                        <List size={12} />
                     </button>
                     <button className="text-gray-400">
                        <Plus size={12} />
                     </button>
                  </div>
               </div>
               <ul>
                  <li className="mb-1">
                     <a
                        href="#"
                        className="flex items-center px-2 py-1 text-sm text-gray-700 rounded hover:bg-bg-white"
                     >
                        <Star size={12} className="mr-2 text-gray-400" />
                        <span>Favorites</span>
                     </a>
                  </li>
                  <li className="mb-1">
                     <a
                        href="#"
                        className="flex items-center px-2 py-1 text-sm text-gray-700 rounded hover:bg-bg-white"
                     >
                        <File size={12} className="mr-2 text-gray-400" />
                        <span>Uploads</span>
                     </a>
                  </li>
                  <li className="mb-1">
                     <a
                        href="#"
                        className="flex items-center px-2 py-1 text-sm text-gray-700 rounded hover:bg-bg-white"
                     >
                        <Edit size={12} className="mr-2 text-gray-400" />
                        <span>Labeling</span>
                     </a>
                  </li>
                  <li className="mb-0">
                     <a
                        href="#"
                        className="flex items-center px-2 py-1 text-gray-700 rounded hover:bg-bg-white"
                     >
                        <Clock size={12} className="mr-2 text-gray-500" />
                        <span>Created by me</span>
                     </a>
                  </li>
               </ul>
            </div>

            <div className="p-4 border-t border-gray-200">
               <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-sm">Projects</h3>
                  <div className="flex">
                     <button className="text-gray-400 mr-1">
                        <List size={12} />
                     </button>
                     <button className="text-gray-400">
                        <Plus size={12} />
                     </button>
                  </div>
               </div>
               <ul>
                  <li className="mb-1">
                     <a
                        href="#"
                        className="flex items-center py-1 text-sm text-gray-700 rounded hover:bg-white"
                     >
                        <span className="ml-2">Adrian Bert - CRM Dashboard</span>
                     </a>
                  </li>
                  <li className="mb-1">
                     <a
                        href="#"
                        className="flex items-center py-1 text-sm text-gray-700 rounded hover:bg-white"
                     >
                        <span className="ml-2">Trust - SaaS Dashboard</span>
                     </a>
                  </li>
                  <li className="mb-1">
                     <a
                        href="#"
                        className="flex items-center py-1 text-sm text-gray-700 rounded hover:bg-white"
                     >
                        <span className="ml-2">Pertamina Project</span>
                     </a>
                  </li>
                  <li className="mb-1">
                     <a
                        href="#"
                        className="flex items-center px-1 py-1 text-sm text-gray-700 rounded hover:bg-white"
                     >
                        <span className="ml-2">Garuda Project</span>
                     </a>
                  </li>
               </ul>
            </div>
         </div>

         <div className="p-4 border-t border-gray-200">
            <ul>
               <li className="mb-1">
                  <a
                     href="#"
                     className="flex items-center px-4 text-gray-700 rounded hover:bg-white"
                  >
                     <Settings size={12} className="mr-3 text-gray-500" />
                     <span>Settings</span>
                  </a>
               </li>
               <li>
                  <a
                     href="#"
                     className="flex items-center px-4  text-gray-700 rounded hover:bg-white"
                  >
                     <span className="mr-3 text-gray-500">?</span>
                     <span>Help Center</span>
                  </a>
               </li>
            </ul>
         </div>

         <div className="p-4 border-gray-200">
            <div className="flex items-center">
               <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
               <div className="flex-1">
                  <p className="text-sm font-medium">{user?.firstName || user?.username || 'U'}</p>
                  <p className="text-xs text-gray-500">
                     {user?.primaryEmailAddress?.emailAddress || 'email'}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

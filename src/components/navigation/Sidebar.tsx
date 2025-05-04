import React, { useState } from 'react';
import {
   Home,
   CheckSquare,
   Clock,
   List,
   Plus,
   Star,
   Settings,
   File,
   Edit,
   ChevronRight,
   ChevronLeft,
} from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
   const { user } = useUser();
   const [isCollapsed, setIsCollapsed] = useState(false);

   const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
   };

   return (
      <div
         className={cn(
            'bg-gray-100 border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out relative',
            isCollapsed ? 'w-16' : 'w-51',
         )}
      >
         {/* Collapse toggle button */}
         <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-16 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 border border-gray-200 z-10"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
         >
            {isCollapsed ? (
               <ChevronRight size={16} className="text-gray-500" />
            ) : (
               <ChevronLeft size={16} className="text-gray-500" />
            )}
         </button>

         {/* Logo/App header */}
         <div className="px-4 py-3 border-gray-200 flex items-center">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white mr-2">
               A
            </div>
            {!isCollapsed && <h1 className="font-semibold">Language Platform</h1>}
         </div>

         {/* Workspace section */}
         <div className="px-4 py-2 border-gray-200">
            <div className="flex items-center justify-between">
               <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white mr-2">
                     K
                  </div>
                  {!isCollapsed && <span>Training Datasets</span>}
               </div>
               {!isCollapsed && (
                  <button className="text-gray-400">
                     <List size={12} />
                  </button>
               )}
            </div>
         </div>

         {/* Main navigation */}
         <div className="flex-1 overflow-y-auto">
            <ul className="p-2">
               <li className="mb-0">
                  <a
                     href="/chat"
                     className="flex items-center px-4 py-1 text-gray-700 rounded hover:bg-white"
                     title="QA Tests"
                  >
                     <Home size={12} className="mr-3 text-gray-500" />
                     {!isCollapsed && <span>QA Tests</span>}
                  </a>
               </li>
               <li className="mb-0">
                  <a
                     href="#"
                     className="flex items-center px-4 py-1 text-gray-700 rounded hover:bg-white"
                     title="ToDo"
                  >
                     <CheckSquare size={12} className="mr-3 text-gray-500" />
                     {!isCollapsed && <span>ToDo</span>}
                  </a>
               </li>
            </ul>

            {/* Datasets section */}
            <div className="p-4 border-t border-gray-200">
               <div className="flex items-center justify-between mb-2">
                  {!isCollapsed && <h3 className="font-medium text-sm">Datasets</h3>}
                  {!isCollapsed ? (
                     <div className="flex">
                        <button className="text-gray-400 mr-1">
                           <List size={12} />
                        </button>
                        <button className="text-gray-400">
                           <Plus size={12} />
                        </button>
                     </div>
                  ) : (
                     <div className="w-full flex justify-center">
                        <File size={16} className="text-gray-500" />
                     </div>
                  )}
               </div>
               {!isCollapsed && (
                  <ul>
                     <li className="mb-1">
                        <a
                           href="#"
                           className="flex items-center px-2 py-1 text-sm text-gray-700 rounded hover:bg-white"
                        >
                           <Star size={12} className="mr-2 text-gray-400" />
                           <span>Favorites</span>
                        </a>
                     </li>
                     <li className="mb-1">
                        <a
                           href="#"
                           className="flex items-center px-2 py-1 text-sm text-gray-700 rounded hover:bg-white"
                        >
                           <File size={12} className="mr-2 text-gray-400" />
                           <span>Uploads</span>
                        </a>
                     </li>
                     <li className="mb-1">
                        <a
                           href="#"
                           className="flex items-center px-2 py-1 text-sm text-gray-700 rounded hover:bg-white"
                        >
                           <Edit size={12} className="mr-2 text-gray-400" />
                           <span>Labeling</span>
                        </a>
                     </li>
                     <li className="mb-0">
                        <a
                           href="#"
                           className="flex items-center px-2 py-1 text-gray-700 rounded hover:bg-white"
                        >
                           <Clock size={12} className="mr-2 text-gray-500" />
                           <span>Created by me</span>
                        </a>
                     </li>
                  </ul>
               )}
            </div>

            {/* Projects section */}
            {!isCollapsed && (
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
            )}
         </div>

         {/* Settings section */}
         <div className="p-4 border-t border-gray-200">
            <ul>
               <li className="mb-1">
                  <a
                     href="#"
                     className={cn(
                        'flex items-center text-gray-700 rounded hover:bg-white',
                        isCollapsed ? 'justify-center px-2' : 'px-4',
                     )}
                     title="Settings"
                  >
                     <Settings size={12} className={isCollapsed ? '' : 'mr-3'} />
                     {!isCollapsed && <span>Settings</span>}
                  </a>
               </li>
               <li>
                  <a
                     href="#"
                     className={cn(
                        'flex items-center text-gray-700 rounded hover:bg-white',
                        isCollapsed ? 'justify-center px-2' : 'px-4',
                     )}
                     title="Help Center"
                  >
                     <span className={cn('text-gray-500', isCollapsed ? '' : 'mr-3')}>?</span>
                     {!isCollapsed && <span>Help Center</span>}
                  </a>
               </li>
            </ul>
         </div>

         {/* User profile section */}
         <div className="p-4 border-gray-200">
            <div className={cn('flex items-center', isCollapsed && 'justify-center')}>
               <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 flex-shrink-0 flex items-center justify-center">
                  <UserButton afterSignOutUrl="/sign-in" />
               </div>
               {!isCollapsed && (
                  <div className="flex-1">
                     <p className="text-sm font-medium">
                        {user?.firstName || user?.username || 'User'}
                     </p>
                     <p className="text-xs text-gray-500 truncate">
                        {user?.primaryEmailAddress?.emailAddress || 'email'}
                     </p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

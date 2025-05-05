import React, { useState } from 'react';
import {
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
   GraduationCap,
   Logs,
   FlaskConical,
} from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

interface SidebarProps {
   onNavigate: (page: string) => void; // Add this prop for navigation
   activePage: string; // Add this to track the active page
}

export const Sidebar = ({ onNavigate, activePage }: SidebarProps) => {
   const { user } = useUser();
   const [isCollapsed, setIsCollapsed] = useState(false);

   const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
   };

   // Helper to create navigation item with active state
   const NavItem = ({
      id,
      title,
      icon,
      onClick,
   }: {
      id: string;
      title: string;
      icon: React.ReactNode;
      onClick: () => void;
   }) => (
      <li className="mb-0">
         <button
            onClick={onClick}
            className={`flex items-center w-full text-left px-4 py-1 rounded ${
               activePage === id ? 'bg-white text-blue-600' : 'text-gray-700 hover:bg-white'
            }`}
            title={title}
         >
            <span className={`mr-3 ${activePage === id ? 'text-blue-600' : 'text-gray-500'}`}>
               {icon}
            </span>
            {!isCollapsed && <span>{title}</span>}
         </button>
      </li>
   );

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
            <div
               className="w-8 h-8 bg-black rounded flex items-center justify-center text-white mr-2 cursor-pointer"
               onClick={() => onNavigate('dashboard')}
            >
               A
            </div>
            {!isCollapsed && (
               <h1 className="font-semibold cursor-pointer" onClick={() => onNavigate('dashboard')}>
                  Language Platform
               </h1>
            )}
         </div>

         {/* Workspace section */}
         <div className="px-4 py-2 border-gray-200">
            <div className="flex items-center justify-between">
               <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white mr-2">
                     K
                  </div>
                  {!isCollapsed && <span>Training Models</span>}
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
               <NavItem
                  id="training"
                  title="Training"
                  icon={<GraduationCap size={12} />}
                  onClick={() => onNavigate('training')}
               />
               <NavItem
                  id="logs"
                  title="Logs"
                  icon={<Logs size={12} />}
                  onClick={() => onNavigate('logs')}
               />
               <NavItem
                  id="evaluate"
                  title="Evaluate | Chat"
                  icon={<FlaskConical size={12} />}
                  onClick={() => onNavigate('evaluate')}
               />
               <NavItem
                  id="todo"
                  title="ToDo"
                  icon={<CheckSquare size={12} />}
                  onClick={() => onNavigate('todo')}
               />
            </ul>

            {/* Datasets section */}
            <div className="p-4 border-t border-gray-200">
               <div className="flex items-center justify-between mb-2">
                  {!isCollapsed && <h3 className="font-medium text-sm"> Datasets</h3>}
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
                        <button
                           onClick={() => onNavigate('favorites')}
                           className={`flex items-center w-full text-left px-2 py-1 text-sm rounded ${
                              activePage === 'favorites'
                                 ? 'bg-white text-blue-600'
                                 : 'text-gray-700 hover:bg-white'
                           }`}
                        >
                           <Star
                              size={12}
                              className={`mr-2 ${activePage === 'favorites' ? 'text-blue-600' : 'text-gray-400'}`}
                           />
                           <span>Favorites</span>
                        </button>
                     </li>
                     <li className="mb-1">
                        <button
                           onClick={() => onNavigate('uploads')}
                           className={`flex items-center w-full text-left px-2 py-1 text-sm rounded ${
                              activePage === 'uploads'
                                 ? 'bg-white text-blue-600'
                                 : 'text-gray-700 hover:bg-white'
                           }`}
                        >
                           <File
                              size={12}
                              className={`mr-2 ${activePage === 'uploads' ? 'text-blue-600' : 'text-gray-400'}`}
                           />
                           <span>Uploads</span>
                        </button>
                     </li>
                     <li className="mb-1">
                        <button
                           onClick={() => onNavigate('labeling')}
                           className={`flex items-center w-full text-left px-2 py-1 text-sm rounded ${
                              activePage === 'labeling'
                                 ? 'bg-white text-blue-600'
                                 : 'text-gray-700 hover:bg-white'
                           }`}
                        >
                           <Edit
                              size={12}
                              className={`mr-2 ${activePage === 'labeling' ? 'text-blue-600' : 'text-gray-400'}`}
                           />
                           <span>Labeling</span>
                        </button>
                     </li>
                     <li className="mb-0">
                        <button
                           onClick={() => onNavigate('created')}
                           className={`flex items-center w-full text-left px-2 py-1 text-sm rounded ${
                              activePage === 'created'
                                 ? 'bg-white text-blue-600'
                                 : 'text-gray-700 hover:bg-white'
                           }`}
                        >
                           <Clock
                              size={12}
                              className={`mr-2 ${activePage === 'created' ? 'text-blue-600' : 'text-gray-500'}`}
                           />
                           <span>Created by me</span>
                        </button>
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
                        <button
                           onClick={() => onNavigate('project-1')}
                           className={`flex items-center w-full text-left py-1 text-sm rounded ${
                              activePage === 'project-1'
                                 ? 'bg-white text-blue-600'
                                 : 'text-gray-700 hover:bg-white'
                           }`}
                        >
                           <span className="ml-2">Twi Project 1</span>
                        </button>
                     </li>
                     <li className="mb-1">
                        <button
                           onClick={() => onNavigate('project-2')}
                           className={`flex items-center w-full text-left py-1 text-sm rounded ${
                              activePage === 'project-2'
                                 ? 'bg-white text-blue-600'
                                 : 'text-gray-700 hover:bg-white'
                           }`}
                        >
                           <span className="ml-2">Spanish</span>
                        </button>
                     </li>

                     <li className="mb-1">
                        <button
                           onClick={() => onNavigate('project-4')}
                           className={`flex items-center w-full text-left px-1 py-1 text-sm rounded ${
                              activePage === 'project-4'
                                 ? 'bg-white text-blue-600'
                                 : 'text-gray-700 hover:bg-white'
                           }`}
                        >
                           <span className="ml-2">Swahili</span>
                        </button>
                     </li>
                  </ul>
               </div>
            )}
         </div>

         {/* Settings section */}
         <div className="p-4 border-t border-gray-200">
            <ul>
               <li className="mb-1">
                  <button
                     onClick={() => onNavigate('settings')}
                     className={cn(
                        'flex items-center w-full text-left rounded',
                        activePage === 'settings'
                           ? 'bg-white text-blue-600'
                           : 'text-gray-700 hover:bg-white',
                        isCollapsed ? 'justify-center px-2' : 'px-4',
                     )}
                     title="Settings"
                  >
                     <Settings
                        size={12}
                        className={cn(
                           isCollapsed ? '' : 'mr-3',
                           activePage === 'settings' ? 'text-blue-600' : '',
                        )}
                     />
                     {!isCollapsed && <span>Settings</span>}
                  </button>
               </li>
               <li>
                  <button
                     onClick={() => onNavigate('help')}
                     className={cn(
                        'flex items-center w-full text-left rounded',
                        activePage === 'help'
                           ? 'bg-white text-blue-600'
                           : 'text-gray-700 hover:bg-white',
                        isCollapsed ? 'justify-center px-2' : 'px-4',
                     )}
                     title="Help Center"
                  >
                     <span
                        className={cn(
                           activePage === 'help' ? 'text-blue-600' : 'text-gray-500',
                           isCollapsed ? '' : 'mr-3',
                        )}
                     >
                        ?
                     </span>
                     {!isCollapsed && <span>Help Center</span>}
                  </button>
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

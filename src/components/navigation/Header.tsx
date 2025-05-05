import React from 'react';
import { Share2, Bell } from 'lucide-react';

interface HeaderProps {
   breadcrumbs: string[];
   notifications?: number;
}

export const Header = ({ breadcrumbs = [], notifications = 0 }: HeaderProps) => {
   const title = breadcrumbs.length > 0 ? breadcrumbs[0] : '';

   return (
      <header className="bg-white border-b border-gray-200 px-6 py-4">
         <div className="flex items-center justify-between">
            <div className="flex items-center">
               <h2 className="text-lg font-semibold mr-4">{title}</h2>
               {breadcrumbs.length > 1 && (
                  <>
                     {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                           {index > 0 && <span className="text-gray-500 mx-2">›</span>}
                           {index > 0 && (
                              <span
                                 className={`${index === breadcrumbs.length - 1 ? 'text-gray-700' : 'text-gray-500 hover:text-gray-700 cursor-pointer'}`}
                              >
                                 {crumb}
                              </span>
                           )}
                        </React.Fragment>
                     ))}
                  </>
               )}
            </div>

            <div className="flex items-center">
               {notifications > 0 && (
                  <button className="w-8 h-8 flex items-center justify-center text-gray-500 rounded-full hover:bg-gray-100 mr-2">
                     <span className="relative">
                        <Bell size={18} />
                        <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                           {notifications}
                        </span>
                     </span>
                  </button>
               )}
               <button className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  <Share2 size={16} className="mr-1" />
                  <span>Share</span>
               </button>
            </div>
         </div>
      </header>
   );
};

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TaskGroup } from '../utils/types';

interface DashboardContextType {
   taskGroups: TaskGroup[];
   activeTab: string;
   setActiveTab: (tab: string) => void;
   addTaskGroup: (group: TaskGroup) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
   const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([
      {
         id: '1',
         title: 'In Progress',
         color: 'bg-yellow-400',
         tasks: [
            // Initial tasks...
         ],
      },
   ]);
   const [activeTab, setActiveTab] = useState('spreadsheet');

   const addTaskGroup = (group: TaskGroup) => {
      setTaskGroups((prev) => [...prev, group]);
   };

   return (
      <DashboardContext.Provider
         value={{
            taskGroups,
            activeTab,
            setActiveTab,
            addTaskGroup,
         }}
      >
         {children}
      </DashboardContext.Provider>
   );
};

export const useDashboard = () => {
   const context = useContext(DashboardContext);
   if (context === undefined) {
      throw new Error('useDashboard must be used within a DashboardProvider');
   }
   return context;
};

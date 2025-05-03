import { useState } from 'react';
import { TaskGroup } from '../utils/types';

export function useDashboardData() {
   const [taskGroups] = useState<TaskGroup[]>([
      {
         id: '1',
         title: 'In Progress',
         color: 'bg-yellow-400',
         tasks: [
            {
               id: '1-1',
               title: 'Wireframing',
               isChecked: false,
               description: '-',
               assignees: ['AB', 'CD', 'EF'],
               dueDate: 'February 12, 2024',
               priority: 'Urgent',
               progress: 85,
               subtasks: 3,
               completedSubtasks: 3,
            },
            {
               id: '1-2',
               title: 'Dashboard',
               isChecked: true,
               description: 'Create wireframe for Dashboard page',
               assignees: ['AB', 'CD'],
               dueDate: 'February 12, 2024',
               priority: 'Urgent',
               progress: 95,
            },
            {
               id: '1-3',
               title: 'Analytics',
               isChecked: true,
               description: 'Create wireframe for analytics page',
               assignees: ['AB', 'CD', 'EF'],
               dueDate: 'February 12, 2024',
               priority: 'Urgent',
               progress: 100,
            },
            {
               id: '1-4',
               title: 'Messages',
               isChecked: false,
               description: 'Create wireframe for messages page',
               assignees: ['AB', 'CD'],
               dueDate: 'February 12, 2024',
               priority: 'Normal',
               progress: 34,
            },
         ],
      },
      {
         id: '2',
         title: 'Ready to check by PM',
         color: 'bg-purple-500',
         tasks: [
            {
               id: '2-1',
               title: 'Wireframing',
               isChecked: true,
               description: '-',
               assignees: ['AB', 'CD', 'EF'],
               dueDate: 'February 8, 2024',
               priority: 'Urgent',
               progress: 100,
               subtasks: 3,
               completedSubtasks: 3,
            },
            {
               id: '2-2',
               title: 'Onboarding',
               isChecked: true,
               description: '-',
               assignees: ['AB', 'CD'],
               dueDate: 'February 8, 2024',
               priority: 'Urgent',
               progress: 95,
               subtasks: 2,
               completedSubtasks: 2,
            },
            {
               id: '2-3',
               title: 'Login Screen',
               isChecked: true,
               description: '-',
               assignees: ['AB', 'CD', 'EF'],
               dueDate: 'February 8, 2024',
               priority: 'Urgent',
               progress: 100,
            },
            {
               id: '2-4',
               title: 'Sign Up Screen',
               isChecked: true,
               description: '-',
               assignees: ['AB', 'CD'],
               dueDate: 'February 8, 2024',
               priority: 'Normal',
               progress: 95,
               subtasks: 1,
               completedSubtasks: 1,
            },
         ],
      },
   ]);

   // State for active tab
   const [activeTab, setActiveTab] = useState('spreadsheet');

   return {
      taskGroups,
      activeTab,
      setActiveTab,
   };
}

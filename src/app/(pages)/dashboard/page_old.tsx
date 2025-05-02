// pages/dashboard.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  Grid, 
  Home, 
  Inbox, 
  List, 
  Plus, 
  Search, 
  Settings, 
  Share2, 
  Star, 
  Users 
} from 'lucide-react';
import Head from 'next/head';

// Task Type Definition
interface Task {
  id: string;
  title: string;
  isChecked: boolean;
  description?: string;
  assignees: string[];
  dueDate: string;
  priority: 'Low' | 'Normal' | 'Urgent';
  progress: number;
  subtasks?: number;
  completedSubtasks?: number;
}

// TaskGroup Type Definition
interface TaskGroup {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

// Component for Avatar
const Avatar = ({ initials, color }: { initials: string, color: string }) => (
  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${color}`}>
    {initials}
  </div>
);

// AvatarGroup Component
const AvatarGroup = ({ assignees }: { assignees: string[] }) => {
  return (
    <div className="flex -space-x-2">
      {assignees.map((initials, index) => {
        const colors = [
          'bg-purple-500', 'bg-blue-500', 'bg-green-500', 
          'bg-yellow-500', 'bg-red-500', 'bg-pink-500'
        ];
        return (
          <Avatar 
            key={index} 
            initials={initials} 
            color={colors[index % colors.length]} 
          />
        );
      })}
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-32 bg-gray-200 rounded-full h-2">
    <div 
      className="bg-blue-600 h-2 rounded-full" 
      style={{ width: `${progress}%` }}
    />
  </div>
);

// Priority Badge Component
const PriorityBadge = ({ priority }: { priority: 'Low' | 'Normal' | 'Urgent' }) => {
  const colorMap = {
    'Low': 'text-gray-600',
    'Normal': 'text-blue-600',
    'Urgent': 'text-red-600'
  };
  
  return (
    <div className={`flex items-center ${colorMap[priority]}`}>
      <span className="mr-1">↑</span>
      <span>{priority}</span>
    </div>
  );
};

// Task Row Component
const TaskRow = ({ task }: { task: Task }) => {
  return (
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
          <span>{task.title}</span>
          {task.subtasks && (
            <span className="ml-2 text-xs text-gray-500">
              {task.completedSubtasks || 0}/{task.subtasks}
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-2 text-sm text-gray-600">
        {task.description || '-'}
      </td>
      <td className="py-3 px-2">
        <AvatarGroup assignees={task.assignees} />
      </td>
      <td className="py-3 px-2 text-sm">{task.dueDate}</td>
      <td className="py-3 px-2">
        <PriorityBadge priority={task.priority} />
      </td>
      <td className="py-3 px-2">
        <ProgressBar progress={task.progress} />
      </td>
      <td className="py-3 px-2 text-right">
        <button className="text-gray-500 hover:text-gray-700">
          <List size={16} />
        </button>
      </td>
    </motion.tr>
  );
};

// TaskGroup Component
const TaskGroup = ({ group }: { group: TaskGroup }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mr-2 text-gray-500"
        >
          {isExpanded ? '▼' : '►'}
        </button>
        <div 
          className={`w-3 h-3 rounded-full ${group.color} mr-2`}
        />
        <h3 className="font-medium">{group.title}</h3>
        <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {group.tasks.length}
        </span>
        <button className="ml-auto text-gray-500 hover:text-gray-700">
          <List size={16} />
        </button>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="py-2 px-2 font-medium">Task</th>
                <th className="py-2 px-2 font-medium">Description</th>
                <th className="py-2 px-2 font-medium">Assignee</th>
                <th className="py-2 px-2 font-medium">Due Date</th>
                <th className="py-2 px-2 font-medium">Priority</th>
                <th className="py-2 px-2 font-medium">Progress</th>
                <th className="py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {group.tasks.map(task => (
                <TaskRow key={task.id} task={task} />
              ))}
            </tbody>
          </table>
          
          <button className="mt-4 flex items-center text-gray-500 hover:text-gray-700 text-sm">
            <Plus size={16} className="mr-1" /> Add task
          </button>
        </motion.div>
      )}
    </div>
  );
};

// Main Dashboard Page Component
export default function Dashboard() {
  // Sample data for the dashboard
  const taskGroups: TaskGroup[] = [
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
          completedSubtasks: 3
        },
        {
          id: '1-2',
          title: 'Dashboard',
          isChecked: true,
          description: 'Create wireframe for Dashboard page',
          assignees: ['AB', 'CD'],
          dueDate: 'February 12, 2024',
          priority: 'Urgent',
          progress: 95
        },
        {
          id: '1-3',
          title: 'Analytics',
          isChecked: true,
          description: 'Create wireframe for analytics page',
          assignees: ['AB', 'CD', 'EF'],
          dueDate: 'February 12, 2024',
          priority: 'Urgent',
          progress: 100
        },
        {
          id: '1-4',
          title: 'Messages',
          isChecked: false,
          description: 'Create wireframe for messages page',
          assignees: ['AB', 'CD'],
          dueDate: 'February 12, 2024',
          priority: 'Normal',
          progress: 34
        },
      ]
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
          completedSubtasks: 3
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
          completedSubtasks: 2
        },
        {
          id: '2-3',
          title: 'Login Screen',
          isChecked: true,
          description: '-',
          assignees: ['AB', 'CD', 'EF'],
          dueDate: 'February 8, 2024',
          priority: 'Urgent',
          progress: 100
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
          completedSubtasks: 1
        }
      ]
    }
  ];
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('spreadsheet');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>AutomatePro - Dashboard</title>
        <meta name="description" content="Project management dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white mr-2">A</div>
            <h1 className="font-semibold">AutomatePro</h1>
          </div>
          
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white mr-2">K</div>
                <span>Keitoto Studio</span>
              </div>
              <button className="text-gray-400">
                <List size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <ul className="p-2">
              <li className="mb-1">
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-gray-100">
                  <Home size={18} className="mr-3 text-gray-500" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li className="mb-1">
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-gray-100">
                  <Inbox size={18} className="mr-3 text-gray-500" />
                  <span>Inbox</span>
                </a>
              </li>
              <li className="mb-1">
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-gray-100">
                  <Users size={18} className="mr-3 text-gray-500" />
                  <span>Teams</span>
                </a>
              </li>
              <li className="mb-1">
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-gray-100">
                  <CheckSquare size={18} className="mr-3 text-gray-500" />
                  <span>Assigned to me</span>
                </a>
              </li>
              <li className="mb-1">
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-gray-100">
                  <Clock size={18} className="mr-3 text-gray-500" />
                  <span>Created by me</span>
                </a>
              </li>
            </ul>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">Favorites</h3>
                <div className="flex">
                  <button className="text-gray-400 mr-1">
                    <List size={14} />
                  </button>
                  <button className="text-gray-400">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <ul>
                <li className="mb-1">
                  <a href="#" className="flex items-center px-2 py-1 text-sm text-gray-700 rounded hover:bg-gray-100">
                    <Star size={14} className="mr-2 text-gray-400" />
                    <span>Starred items</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">Projects</h3>
                <div className="flex">
                  <button className="text-gray-400 mr-1">
                    <List size={14} />
                  </button>
                  <button className="text-gray-400">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <ul>
                <li className="mb-1">
                  <a href="#" className="flex items-center px-2 py-1 text-sm text-gray-700 rounded hover:bg-gray-100">
                    <span className="ml-2">Adrian Bert - CRM Dashboard</span>
                  </a>
                </li>
                <li className="mb-1">
                  <a href="#" className="flex items-center px-2 py-1 text-sm text-gray-700 rounded hover:bg-gray-100">
                    <span className="ml-2">Trust - SaaS Dashboard</span>
                  </a>
                </li>
                <li className="mb-1">
                  <a href="#" className="flex items-center px-2 py-1 text-sm text-gray-700 rounded hover:bg-gray-100">
                    <span className="ml-2">Pertamina Project</span>
                  </a>
                </li>
                <li className="mb-1">
                  <a href="#" className="flex items-center px-2 py-1 text-sm text-gray-700 rounded hover:bg-gray-100">
                    <span className="ml-2">Garuda Project</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <ul>
              <li className="mb-1">
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-gray-100">
                  <Settings size={18} className="mr-3 text-gray-500" />
                  <span>Settings</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-gray-100">
                  <span className="mr-3 text-gray-500">?</span>
                  <span>Help Center</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Darlene Robertson</p>
                <p className="text-xs text-gray-500">darlene@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold mr-4">Projects</h2>
                <span className="text-gray-500 mx-2">›</span>
                <span className="text-gray-700">Adrian Bert - CRM Dashboard</span>
              </div>
              
              <div className="flex items-center">
                <button className="w-8 h-8 flex items-center justify-center text-gray-500 rounded-full hover:bg-gray-100 mr-2">
                  <span className="text-sm bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">2</span>
                </button>
                <button className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  <Share2 size={16} className="mr-1" />
                  <span>Share</span>
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex mt-6 border-b border-gray-200">
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
          </header>
          
          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-6 bg-white">
            <div className="flex justify-between mb-6">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {taskGroups.map(group => (
                <TaskGroup key={group.id} group={group} />
              ))}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
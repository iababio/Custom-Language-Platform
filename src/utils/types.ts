// Define core application types

export interface Task {
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

export interface TaskGroup {
   id: string;
   title: string;
   tasks: Task[];
   color: string;
}

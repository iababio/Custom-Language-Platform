// Define core application types

export interface Task {
   id: string;
   english: string;
   lrl?: string;
   xcl?: string; // Added this field for IC-XCL data
   isChecked: boolean;
   assignees: string[];
   dueDate?: string;
   priority: 'Urgent' | 'Normal' | 'Low';
   progress: number;
   subtasks?: number;
   completedSubtasks?: number;
}

export interface TaskGroup {
   id: string;
   title: string;
   color: string;
   tasks: Task[];
}

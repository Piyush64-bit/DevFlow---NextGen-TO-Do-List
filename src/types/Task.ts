export interface Task {
  id: string;
  title: string;
  description: string;
  notes: string;
  status: 'backlog' | 'in-progress' | 'in-review' | 'done';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  githubCommit?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  estimatedTime?: number;
  actualTime?: number;
}

export interface PomodoroSession {
  taskId: string;
  duration: number;
  completedAt: Date;
}
import { useState, useCallback } from 'react';
import { Task } from '../types/Task';
import { useLocalStorage } from './useLocalStorage';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('developer-tasks', []);
  const [filter, setFilter] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, [setTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  const moveTask = useCallback((id: string, newStatus: Task['status']) => {
    updateTask(id, { 
      status: newStatus,
      completedAt: newStatus === 'done' ? new Date() : undefined
    });
  }, [updateTask]);

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = !filter || 
      task.title.toLowerCase().includes(filter.toLowerCase()) ||
      task.description.toLowerCase().includes(filter.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => task.tags.includes(tag));
    
    return matchesFilter && matchesTags;
  });

  const tasksByStatus = {
    backlog: filteredTasks.filter(task => task.status === 'backlog'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    'in-review': filteredTasks.filter(task => task.status === 'in-review'),
    done: filteredTasks.filter(task => task.status === 'done'),
  };

  const allTags = [...new Set(tasks.flatMap(task => task.tags))];

  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    tasks: filteredTasks,
    tasksByStatus,
    allTags,
    filter,
    setFilter,
    selectedTags,
    setSelectedTags,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    completedTasks,
    totalTasks,
    completionRate,
  };
}
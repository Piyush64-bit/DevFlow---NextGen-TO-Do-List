import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Task } from '../types/Task';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (id: string) => void;
  onAddTask: (status: Task['status']) => void;
  onDrop: (taskId: string, newStatus: Task['status']) => void;
}

export function KanbanColumn({ title, status, tasks, onTaskEdit, onTaskDelete, onAddTask, onDrop }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    onDrop(taskId, status);
  };

  const statusColors = {
    backlog: {
      border: 'border-t-gray-500',
      glow: 'shadow-gray-500/20',
      accent: 'text-gray-400'
    },
    'in-progress': {
      border: 'border-t-[#B88E2F]',
      glow: 'shadow-[#B88E2F]/20',
      accent: 'text-[#B88E2F]'
    },
    'in-review': {
      border: 'border-t-purple-500',
      glow: 'shadow-purple-500/20',
      accent: 'text-purple-400'
    },
    done: {
      border: 'border-t-emerald-500',
      glow: 'shadow-emerald-500/20',
      accent: 'text-emerald-400'
    },
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      className={`bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border-t-4 ${statusColors[status].border} border border-gray-800/50 shadow-2xl ${statusColors[status].glow} ${
        isDragOver ? 'bg-gray-800/60 border-2 border-dashed border-[#B88E2F]/50 scale-105' : ''
      } transition-all duration-300`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      variants={columnVariants}
      initial="hidden"
      animate="visible"
      custom={['backlog', 'in-progress', 'in-review', 'done'].indexOf(status)}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-white text-lg">{title}</h2>
          <motion.span 
            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status].accent} bg-gray-800/50 border border-gray-700/50`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {tasks.length}
          </motion.span>
        </div>
        <motion.button
          onClick={() => onAddTask(status)}
          className={`p-2 rounded-xl transition-all duration-300 hover:bg-gray-800/50 border border-gray-700/50 hover:border-[#B88E2F]/30 ${statusColors[status].accent} hover:text-[#B88E2F]`}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="space-y-4 min-h-[300px]">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', task.id);
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -2 }}
          >
            <TaskCard
              task={task}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
            />
          </motion.div>
        ))}
        
        {tasks.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center h-40 text-gray-500 text-sm border-2 border-dashed border-gray-700/50 rounded-xl bg-gray-800/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileHover={{ borderColor: "#B88E2F", scale: 1.02 }}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium">Drop tasks here</div>
              <div className="text-xs mt-1">or click + to add</div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Clock, GitCommit, Tag, Trash2 } from 'lucide-react';
import { Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, isDragging }: TaskCardProps) {
  const priorityColors = {
    low: {
      border: 'border-l-emerald-500',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400'
    },
    medium: {
      border: 'border-l-[#B88E2F]',
      bg: 'bg-[#B88E2F]/10',
      text: 'text-[#B88E2F]'
    },
    high: {
      border: 'border-l-red-500',
      bg: 'bg-red-500/10',
      text: 'text-red-400'
    },
  };

  const statusColors = {
    backlog: 'bg-gray-800/30',
    'in-progress': 'bg-[#B88E2F]/20',
    'in-review': 'bg-purple-600/20',
    done: 'bg-emerald-600/20',
  };

  return (
    <motion.div
      className={`bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border-l-4 ${priorityColors[task.priority].border} border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 cursor-pointer group ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
      onClick={() => onEdit(task)}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
      }}
      whileTap={{ scale: 0.98 }}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-white text-sm line-clamp-2 flex-1 pr-2">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-300 text-xs mb-4 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {task.tags.map((tag) => (
          <motion.span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-[#B88E2F]/20 text-[#B88E2F] text-xs rounded-lg font-medium border border-[#B88E2F]/30"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(184, 142, 47, 0.3)" }}
            transition={{ duration: 0.2 }}
          >
            <Tag className="w-3 h-3" />
            {tag}
          </motion.span>
        ))}
      </div>

      {task.githubCommit && (
        <motion.div 
          className="flex items-center gap-2 mb-3 p-2 bg-gray-900/50 rounded-lg border border-gray-700/30"
          whileHover={{ borderColor: "#B88E2F" }}
          transition={{ duration: 0.2 }}
        >
          <GitCommit className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-300 font-mono truncate">
            {task.githubCommit}
          </span>
        </motion.div>
      )}

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
        <motion.div 
          className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[task.status]} border border-gray-700/30`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {task.status.replace('-', ' ')}
        </motion.div>
      </div>

      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${priorityColors[task.priority].bg} ${priorityColors[task.priority].border} border opacity-60`} />
    </motion.div>
  );
}
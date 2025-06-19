import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award } from 'lucide-react';

interface ProgressChartProps {
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
}

export function ProgressChart({ completedTasks, totalTasks, completionRate }: ProgressChartProps) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <motion.div 
      className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 shadow-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-[#B88E2F]" />
        <h3 className="text-xl font-bold text-white">Progress Overview</h3>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-800"
            />
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B88E2F" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="text-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-[#B88E2F] to-purple-400 bg-clip-text text-transparent">
                {completionRate}%
              </div>
              <div className="text-sm text-gray-400 font-medium">Complete</div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <motion.div 
          className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/30"
          whileHover={{ scale: 1.05, borderColor: "#10B981" }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl font-bold text-emerald-400 mb-1">{completedTasks}</div>
          <div className="text-sm text-gray-400 font-medium">Completed</div>
        </motion.div>
        <motion.div 
          className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/30"
          whileHover={{ scale: 1.05, borderColor: "#3B82F6" }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl font-bold text-blue-400 mb-1">{totalTasks}</div>
          <div className="text-sm text-gray-400 font-medium">Total Tasks</div>
        </motion.div>
      </div>

      {completionRate >= 80 && (
        <motion.div
          className="mt-4 flex items-center justify-center gap-2 text-[#B88E2F] text-sm font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <Award className="w-4 h-4" />
          Great progress, Piyush! 🎉
        </motion.div>
      )}
    </motion.div>
  );
}
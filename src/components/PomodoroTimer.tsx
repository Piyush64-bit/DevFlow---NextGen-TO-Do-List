import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, Coffee } from 'lucide-react';

interface PomodoroTimerProps {
  taskId?: string;
  onSessionComplete: (taskId: string, duration: number) => void;
}

export function PomodoroTimer({ taskId, onSessionComplete }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (taskId && !isBreak) {
        onSessionComplete(taskId, 25 * 60 - timeLeft);
      }
      // Auto switch to break
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, taskId, isBreak, onSessionComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? (5 * 60 - timeLeft) / (5 * 60)
    : (25 * 60 - timeLeft) / (25 * 60);

  return (
    <motion.div 
      className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 shadow-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ rotate: isActive ? [0, 360] : 0 }}
          transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" }}
        >
          {isBreak ? (
            <Coffee className="w-6 h-6 text-emerald-500" />
          ) : (
            <Timer className="w-6 h-6 text-[#B88E2F]" />
          )}
        </motion.div>
        <h3 className="text-xl font-bold text-white">
          {isBreak ? 'Break Time ☕' : 'Focus Time 🎯'}
        </h3>
      </div>

      <div className="text-center">
        <motion.div 
          className="text-5xl font-mono font-bold mb-6"
          key={timeLeft}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <span className={`bg-gradient-to-r ${
            isBreak 
              ? 'from-emerald-400 to-green-500' 
              : 'from-[#B88E2F] to-amber-500'
          } bg-clip-text text-transparent`}>
            {formatTime(timeLeft)}
          </span>
        </motion.div>

        <div className="w-full bg-gray-800/50 rounded-full h-3 mb-8 overflow-hidden">
          <motion.div 
            className={`h-3 rounded-full ${
              isBreak 
                ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                : 'bg-gradient-to-r from-[#B88E2F] to-amber-600'
            } shadow-lg`}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-center gap-4">
          <motion.button
            onClick={toggleTimer}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
              isActive 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/25' 
                : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-emerald-500/25'
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isActive ? 0 : 360 }}
              transition={{ duration: 0.3 }}
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </motion.div>
            {isActive ? 'Pause' : 'Start'}
          </motion.button>
          
          <motion.button
            onClick={resetTimer}
            className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold bg-gray-700/50 hover:bg-gray-600/50 text-white transition-all duration-300 border border-gray-600/50 hover:border-[#B88E2F]/30"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileHover={{ rotate: -180 }}
              transition={{ duration: 0.3 }}
            >
              <RotateCcw className="w-5 h-5" />
            </motion.div>
            Reset
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
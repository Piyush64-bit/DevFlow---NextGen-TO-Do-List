import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, GitCommit, Clock, Save, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Task } from '../types/Task';

interface TaskModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  initialStatus?: Task['status'];
}

export function TaskModal({ task, isOpen, onClose, onSave, onUpdate, initialStatus = 'backlog' }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    notes: '',
    status: initialStatus,
    priority: 'medium' as Task['priority'],
    tags: [] as string[],
    githubCommit: '',
    estimatedTime: undefined as number | undefined,
  });
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        notes: task.notes,
        status: task.status,
        priority: task.priority,
        tags: task.tags,
        githubCommit: task.githubCommit || '',
        estimatedTime: task.estimatedTime,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        notes: '',
        status: initialStatus,
        priority: 'medium',
        tags: [],
        githubCommit: '',
        estimatedTime: undefined,
      });
    }
  }, [task, initialStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      onUpdate(task.id, formData);
    } else {
      onSave(formData);
    }
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-800/50 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#B88E2F]" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#B88E2F] to-purple-400 bg-clip-text text-transparent">
                  {task ? 'Edit Task' : 'Create New Task'}
                </h2>
              </div>
              <motion.button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-[#B88E2F]/50 focus:ring-2 focus:ring-[#B88E2F]/20 transition-all duration-300"
                  placeholder="Enter task title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-[#B88E2F]/50 focus:ring-2 focus:ring-[#B88E2F]/20 transition-all duration-300"
                  rows={3}
                  placeholder="Describe your task..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-[#B88E2F]/50 focus:ring-2 focus:ring-[#B88E2F]/20 transition-all duration-300"
                  >
                    <option value="backlog">📋 Backlog</option>
                    <option value="in-progress">⚡ In Progress</option>
                    <option value="in-review">👀 In Review</option>
                    <option value="done">✅ Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-[#B88E2F]/50 focus:ring-2 focus:ring-[#B88E2F]/20 transition-all duration-300"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Tags
                </label>
                <div className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag (e.g., frontend, bugfix)..."
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-[#B88E2F]/50 focus:ring-2 focus:ring-[#B88E2F]/20 transition-all duration-300"
                  />
                  <motion.button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-3 bg-gradient-to-r from-[#B88E2F] to-amber-600 hover:from-[#B88E2F]/90 hover:to-amber-600/90 text-white rounded-xl transition-all duration-300 shadow-lg shadow-[#B88E2F]/25"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Tag className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-[#B88E2F]/20 text-[#B88E2F] text-sm rounded-xl font-medium border border-[#B88E2F]/30"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-[#B88E2F] hover:text-white ml-1 hover:bg-red-500/20 rounded-full p-1 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  GitHub Commit
                </label>
                <div className="flex items-center gap-3">
                  <GitCommit className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.githubCommit}
                    onChange={(e) => setFormData(prev => ({ ...prev, githubCommit: e.target.value }))}
                    placeholder="e.g., abc123def456"
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-[#B88E2F]/50 focus:ring-2 focus:ring-[#B88E2F]/20 font-mono text-sm transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Estimated Time (hours)
                </label>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.estimatedTime || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value ? Number(e.target.value) : undefined }))}
                    placeholder="Hours"
                    min="0.5"
                    step="0.5"
                    className="w-32 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-[#B88E2F]/50 focus:ring-2 focus:ring-[#B88E2F]/20 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-300">
                    Notes (Markdown supported)
                  </label>
                  <motion.button
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    className="text-sm text-[#B88E2F] hover:text-amber-400 transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPreview ? '✏️ Edit' : '👁️ Preview'}
                  </motion.button>
                </div>
                {isPreview ? (
                  <div className="w-full min-h-[150px] px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{formData.notes || '*No notes yet*'}</ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Write your notes in Markdown..."
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-[#B88E2F]/50 focus:ring-2 focus:ring-[#B88E2F]/20 font-mono text-sm transition-all duration-300"
                    rows={6}
                  />
                )}
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-300 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#B88E2F] to-amber-600 hover:from-[#B88E2F]/90 hover:to-amber-600/90 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-[#B88E2F]/25"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="w-5 h-5" />
                  {task ? 'Update Task' : 'Create Task'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
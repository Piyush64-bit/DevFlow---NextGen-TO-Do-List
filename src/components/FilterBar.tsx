import React from 'react';
import { motion } from 'framer-motion';
import { Search, X, Filter } from 'lucide-react';

interface FilterBarProps {
  filter: string;
  setFilter: (filter: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  allTags: string[];
}

export function FilterBar({ filter, setFilter, selectedTags, setSelectedTags, allTags }: FilterBarProps) {
  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    );
  };

  const clearFilters = () => {
    setFilter('');
    setSelectedTags([]);
  };

  return (
    <motion.div
      className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 shadow-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#B88E2F]/50 focus:ring-2 focus:ring-[#B88E2F]/20 transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <motion.button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedTags.includes(tag)
                    ? 'bg-gradient-to-r from-[#B88E2F] to-amber-600 text-white shadow-lg shadow-[#B88E2F]/25'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50 hover:border-[#B88E2F]/30'
                }`}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
          
          {(filter || selectedTags.length > 0) && (
            <motion.button
              onClick={clearFilters}
              className="ml-2 p-2 text-gray-400 hover:text-[#B88E2F] hover:bg-gray-800/50 rounded-xl transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
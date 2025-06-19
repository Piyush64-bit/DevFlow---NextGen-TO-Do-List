import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Target, Zap, Github, ExternalLink } from "lucide-react";
import { useTasks } from "./hooks/useTasks";
import { Task } from "./types/Task";
import { KanbanColumn } from "./components/KanbanColumn";
import { TaskModal } from "./components/TaskModal";
import { ProgressChart } from "./components/ProgressChart";
import { PomodoroTimer } from "./components/PomodoroTimer";
import { FilterBar } from "./components/FilterBar";

function App() {
  const {
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
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [modalInitialStatus, setModalInitialStatus] =
    useState<Task["status"]>("backlog");

  const handleAddTask = (status: Task["status"]) => {
    setEditingTask(undefined);
    setModalInitialStatus(status);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    addTask(taskData);
    setIsModalOpen(false);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
    setIsModalOpen(false);
  };

  const handlePomodoroComplete = (taskId: string, duration: number) => {
    updateTask(taskId, {
      actualTime:
        (tasksByStatus["in-progress"].find((t) => t.id === taskId)
          ?.actualTime || 0) +
        duration / 3600,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-600/10 to-orange-600/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 relative z-10">
        {/* Header */}
        <motion.header
          className="mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <motion.div
                className="flex items-center gap-3 text-4xl font-bold flex-wrap"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <motion.img
                  src="/Logo.png"
                  alt="DevFlow Logo"
                  className="w-16 sm:w-20 h-auto object-contain"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <span className="bg-gradient-to-r from-[#B88E2F] via-purple-400 to-blue-400 bg-clip-text text-transparent text-lg sm:text-xl md:text-3xl lg:text-4xl font-semibold text-center block leading-tight">
                  DevFlow: A Smart Dev-To-Do Dashboard
                </span>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <motion.a
                href="https://github.com/Piyush64-bit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-[#B88E2F]/50 text-gray-300 hover:text-[#B88E2F] rounded-xl transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Github className="w-5 h-5" />
                <span className="font-medium">@Piyush64-bit</span>
                <ExternalLink className="w-4 h-4" />
              </motion.a>

              <motion.button
                onClick={() => handleAddTask("backlog")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B88E2F] to-amber-600 hover:from-[#B88E2F]/90 hover:to-amber-600/90 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-[#B88E2F]/25"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <Plus className="w-5 h-5" />
                New Task
              </motion.button>
            </div>
          </div>

          <FilterBar
            filter={filter}
            setFilter={setFilter}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            allTags={allTags}
          />
        </motion.header>

        {/* Stats and Timer Row */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <ProgressChart
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            completionRate={completionRate}
          />
          <PomodoroTimer
            taskId={tasksByStatus["in-progress"][0]?.id}
            onSessionComplete={handlePomodoroComplete}
          />
        </motion.div>

        {/* Kanban Board */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <KanbanColumn
            title="Backlog"
            status="backlog"
            tasks={tasksByStatus.backlog}
            onTaskEdit={handleEditTask}
            onTaskDelete={deleteTask}
            onAddTask={handleAddTask}
            onDrop={moveTask}
          />
          <KanbanColumn
            title="In Progress"
            status="in-progress"
            tasks={tasksByStatus["in-progress"]}
            onTaskEdit={handleEditTask}
            onTaskDelete={deleteTask}
            onAddTask={handleAddTask}
            onDrop={moveTask}
          />
          <KanbanColumn
            title="In Review"
            status="in-review"
            tasks={tasksByStatus["in-review"]}
            onTaskEdit={handleEditTask}
            onTaskDelete={deleteTask}
            onAddTask={handleAddTask}
            onDrop={moveTask}
          />
          <KanbanColumn
            title="Done"
            status="done"
            tasks={tasksByStatus.done}
            onTaskEdit={handleEditTask}
            onTaskDelete={deleteTask}
            onAddTask={handleAddTask}
            onDrop={moveTask}
          />
        </motion.div>

        {/* Task Modal */}
        <TaskModal
          task={editingTask}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
          onUpdate={handleUpdateTask}
          initialStatus={modalInitialStatus}
        />

        {/* Footer */}
        <motion.footer
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex flex-col items-center gap-4 sm:gap-6 text-center px-4">
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05, color: "#B88E2F" }}
                transition={{ duration: 0.2 }}
              >
                <Target className="w-4 h-4" />
                Focus-driven development
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05, color: "#B88E2F" }}
                transition={{ duration: 0.2 }}
              >
                <Zap className="w-4 h-4" />
                Productivity optimized
              </motion.div>
            </div>

            <motion.div
              className="text-gray-500 text-sm font-medium"
              whileHover={{
                scale: 1.05,
                background:
                  "linear-gradient(to right, #B88E2F, #8B5CF6, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              transition={{ duration: 0.3 }}
            >
              © 2025 Designed & Developed by P I Y U $ H |{" "}
              <a
                href="https://github.com/Piyush64-bit"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 hover:text-[#B88E2F] transition-colors duration-300"
              >
                Connect on GitHub
              </a>
            </motion.div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;

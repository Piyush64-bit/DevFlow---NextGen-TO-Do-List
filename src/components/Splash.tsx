import { motion } from "framer-motion";

function Splash() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A23] text-white text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* LOGO */}
      <motion.img
        src="/Logo.png"
        alt="DevFlow Logo"
        className="w-28 h-28 mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />

      {/* Title */}
      <motion.h1
        className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Welcome to DevFlow
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg text-gray-300 max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        Yo Piyush 👋 Ready to organize your dev brain, crush tasks, and level up like a SDE boss?
      </motion.p>
    </motion.div>
  );
}

export default Splash;

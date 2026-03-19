import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -5 }}
    className={`backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/50 shadow-2xl rounded-3xl p-6 ${className}`}
  >
    {children}
  </motion.div>
);
import { motion } from 'framer-motion';

const Loader = () => (
  <div className="flex justify-center items-center h-40">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
        borderRadius: ["20%", "50%", "20%"]
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-12 h-12 bg-blue-600 shadow-lg shadow-blue-400/50"
    />
  </div>
);

export default Loader;
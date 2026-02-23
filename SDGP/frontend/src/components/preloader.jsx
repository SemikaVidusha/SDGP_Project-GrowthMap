import { motion, AnimatePresence } from "framer-motion";

const Preloader = ({ loading }) => {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center 
                     bg-white/70 backdrop-blur-xl"
        >
          <motion.video
            autoPlay
            muted
            loop
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.7}}
            className="w-52 h-52 object-contain rounded-3xl opacity-90"

          >
            <source src="/preloader.mp4" type="video/mp4" />
          </motion.video>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;

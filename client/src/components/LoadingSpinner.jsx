import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-base-100 font-sans">
      <div className="text-3xl font-bold text-primary flex">
        <span>Talk</span>
        <motion.span
          className="ml-1"
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            times: [0, 0.5, 1],
          }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            times: [0.2, 0.6, 1],
            delay: 0.2,
          }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            times: [0.4, 0.8, 1],
            delay: 0.4,
          }}
        >
          .
        </motion.span>
      </div>
    </div>
  );
};

export default LoadingSpinner;

import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface PageErrorProps {
  errMsg: string;
}

const PageError = ({ errMsg }: PageErrorProps) => {
  const navigate = useNavigate()

  const levitateVariants: Variants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const shadowVariants: Variants = {
    animate: {
      scale: [1, 0.8, 1],
      opacity: [0.2, 0.05, 0.2],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-8">
      <div className="relative flex flex-col items-center">
        {/* Floating Icon */}
        <motion.div
          variants={levitateVariants}
          animate="animate"
          className="rounded-full bg-red-500/10 border-2 border-red-500 p-10 text-red-500 shadow-lg shadow-red-500/20"
        >
          <AlertTriangle size={70} strokeWidth={1.5} />
        </motion.div>

        {/* Shadow */}
        <motion.div
          variants={shadowVariants}
          animate="animate"
          className="w-24 h-4 bg-black rounded-[100%] blur-xl absolute -bottom-12"
        />
      </div>

      {/* Error Message */}
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-base-content mb-1">Something went wrong</h2>
        <p className="text-base-content/60 font-mono text-md">{errMsg}</p>
      </div>

      <button 
        className="btn btn-secondary btn-lg mt-7"
        onClick={() => navigate("/")}
      >
        Go Back Home
      </button>
    </div>
  );
};

export default PageError;
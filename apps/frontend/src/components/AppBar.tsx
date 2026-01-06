import { Code } from "lucide-react"
import { motion } from "framer-motion"

import { APP_NAME } from "../constants"
import ThemeToggleButton from "./ThemeToggleButton"

const AppBar = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 1, 
        ease: "easeOut",
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      }}
    >
      <nav className="py-3 border-b border-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between py-3">
            <div className="flex items-center justify-center gap-4">
              <Code size={30} className="text-primary" />
              <h1 className="text-2xl font-bold text-white">
                {APP_NAME}
              </h1>
            </div>
            <ThemeToggleButton />
          </div>
        </div>
      </nav>
    </motion.header>
  )
}

export default AppBar
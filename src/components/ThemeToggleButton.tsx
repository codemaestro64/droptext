'use client'

import { useTheme } from "@/hooks/useTheme"
import { Sun, Moon } from "lucide-react"

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      className="btn-toggle"
      onClick={toggleTheme}
    >
      {theme === 'theme-dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}

export default ThemeToggleButton

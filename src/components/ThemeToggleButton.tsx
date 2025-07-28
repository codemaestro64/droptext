'use client'

import { useTheme } from "@/hooks/useTheme"
import { Sun, Moon } from "lucide-react"

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}

export default ThemeToggleButton

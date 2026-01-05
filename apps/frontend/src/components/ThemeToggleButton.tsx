'use client'

import { ThemeDark } from "../constants"
import { useTheme } from "../hooks/useTheme"
import { Sun, Moon } from "lucide-react"

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      className="btn-toggle cursor-pointer"
      onClick={toggleTheme}
    >
      {theme === ThemeDark ? <Sun size={25} /> : <Moon size={25} />}
    </button>
  )
}

export default ThemeToggleButton

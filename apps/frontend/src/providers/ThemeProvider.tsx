import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"

import { ThemeDark, ThemeLight } from "../constants"

type Theme = typeof ThemeLight | typeof ThemeDark

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return ThemeLight
  return (localStorage.getItem("theme") as Theme) || ThemeLight
}

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    const next = theme === ThemeDark ? ThemeLight : ThemeDark;
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext }
export default ThemeProvider

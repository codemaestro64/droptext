import { createContext } from "react"
import { ThemeDark, ThemeLight } from "../constants"

export type Theme = typeof ThemeLight | typeof ThemeDark

export type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)
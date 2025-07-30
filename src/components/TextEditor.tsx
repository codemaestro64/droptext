'use client'

import CodeMirror from '@uiw/react-codemirror';
import { useTheme } from '@/hooks/useTheme';
import { editorExtensionsFromLanguage } from '@/utils';


interface TextEditorProps {
  onChange?: (val: string) => void
  language: string
  value: string
  editable?: boolean 
  height?: string
}

const TextEditor = ({ onChange, value, language, editable = true, height = "300px" }: TextEditorProps) => {
  const { theme } = useTheme()
  const extensions = editorExtensionsFromLanguage(language)

  const handleChange = (val: string) => {
    if (onChange) {
      onChange(val)
    }
  }

  return (
    <CodeMirror 
      editable={editable}
      value={value}
      height={height}
      extensions={extensions}
      theme={theme === "theme-dark" ? "dark" : "light"}
      onChange={handleChange}
    />
  )
}

export default TextEditor
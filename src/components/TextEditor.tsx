'use client'

import CodeMirror from '@uiw/react-codemirror';
import { go } from '@codemirror/lang-go';
import { useTheme } from '@/hooks/useTheme';


interface TextEditorProps {
  onChange: (val: string) => void
  extension: () => any
  value: string
}

const TextEditor = ({ onChange, value, extension }: TextEditorProps) => {
  const { theme } = useTheme()
  const ext = extension?.();
  const extensions = ext ? [ext] : [];

  return (
    <CodeMirror 
      value={value}
      height="300px"
      extensions={extensions}
      theme={theme === "theme-dark" ? "dark" : "light"}
      onChange={onChange}
    />
  )
}

export default TextEditor
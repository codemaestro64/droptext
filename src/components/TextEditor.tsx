'use client'

import CodeMirror from '@uiw/react-codemirror';
import { go } from '@codemirror/lang-go';
import { useTheme } from '@/hooks/useTheme';


interface TextEditorProps {
  onChange: (val: string) => void
  value: string
}

const TextEditor = ({ onChange, value }: TextEditorProps) => {
  const { theme } = useTheme()

  return (
    <CodeMirror 
      value={value}
      height="300px"
      extensions={[go()]}
      theme={theme}
      onChange={onChange}
    />
  )
}

export default TextEditor
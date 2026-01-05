import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from "@codemirror/view";
import type { Extension } from "@codemirror/state";
import { useTheme } from '../hooks/useTheme';
import { editorExtensionsFromLanguage } from '../utils';
import { ThemeDark } from '../constants';


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

  const editorTheme: Extension = EditorView.theme({
    "&": {
      backgroundColor: "var(--color-base-100)",
      color: "var(--color-base-content)",
    },
    ".cm-content": {
      caretColor: "var(--color-primary)",
      fontFamily: "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
    },
    ".cm-cursor, .cm-dropCursor": { 
      borderLeftColor: "var(--color-primary)" 
    },
    ".cm-activeLine": { 
      backgroundColor: "var(--color-base-200)" 
    },
    ".cm-gutters": {
      backgroundColor: "var(--color-base-200)",
      color: "var(--color-base-content)",
      opacity: "0.5",
      borderRight: "1px solid var(--color-neutral)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "var(--color-base-300)",
      color: "var(--color-primary)",
    },
    /* Selection styling */
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "var(--color-primary) !important",
      opacity: "0.3",
    },
    /* Fold markers and other UI */
    ".cm-foldPlaceholder": {
      backgroundColor: "var(--color-neutral)",
      border: "none",
      color: "var(--color-base-content)"
    }
  }, { dark: theme === ThemeDark });

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
      theme={editorTheme}
      onChange={handleChange}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
      }}
    />
  )
}

export default TextEditor
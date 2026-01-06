import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from "@codemirror/view";
import type { Extension } from "@codemirror/state";
import { useTheme } from '../hooks/useTheme';
import { editorExtensionsFromLanguage } from '../utils';
import { ThemeDark } from '../constants';

interface CodeEditorProps {
  onChange?: (val: string) => void
  language: string
  value: string
  editable?: boolean 
  height?: string
  children?: React.ReactNode
  actions?: React.ReactNode
}

const CodeEditor = ({ 
  value, 
  language, 
  editable = true, 
  height = "300px",
  onChange,
  children,
  actions
}: CodeEditorProps) => {

  const { theme } = useTheme();
  const extensions = editorExtensionsFromLanguage(language);

  const stats = useMemo(() => {
    const chars = value.length;
    const lines = value.length > 0 ? value.split('\n').length : 0;
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    return { chars, lines, words };
  }, [value]);

  const editorTheme: Extension = useMemo(() => EditorView.theme({
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
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "var(--color-primary) !important",
      opacity: "0.3",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "var(--color-neutral)",
      border: "none",
      color: "var(--color-base-content)"
    }
  }, { dark: theme === ThemeDark }), [theme]);

  const handleChange = (val: string) => {
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <div className="border border-secondary/20 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden mb-8">
      <div className="bg-base-200/50 border-b border-base-content/10 p-3 px-7 flex justify-between items-center">
        {children}
      </div>

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

      <div className="bg-base-200/30 border-t border-base-content/10 flex flex-col sm:flex-row gap-4 justify-between items-center p-3 px-7">
        <div className="flex gap-6 text-xs font-mono text-base-content/50">
          <span>CHARS: {stats.chars}</span>
          <span>LINES: {stats.lines}</span>
          <span>WORDS: {stats.words}</span>
        </div>
        <div>{actions}</div>
      </div>
    </div>
  );
};

export default CodeEditor;
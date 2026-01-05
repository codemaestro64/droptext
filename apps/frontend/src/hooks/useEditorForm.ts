import { useState, useCallback } from "react";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@repo/config";

export interface EditorStats {
  characters: number;
  words: number;
  lines: number;
}

export interface LanguageOption {
  value: string;
  label: string;
}

export interface EditorFormState {
  textContent: string;
  password: string;
  isSubmitting: boolean;
  selectedLanguage: LanguageOption;
  duration: number;
  stats: EditorStats;
}

export interface EditorFormReturn {
  state: EditorFormState;
  setters: {
    setPassword: (val: string) => void;
    setSelectedLanguage: (val: string) => void;
    setDuration: (val: number) => void;
  };
  actions: {
    handleEditorChange: (val: string) => void;
    clearContent: () => void;
    handleSubmit: () => Promise<void>;
  };
}

export const useEditorForm = (): EditorFormReturn => {
  const [textContent, setTextContent] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    SUPPORTED_LANGUAGES.find(l => l.value === DEFAULT_LANGUAGE) || SUPPORTED_LANGUAGES[0]
  );
  const [duration, setDuration] = useState<number>(0);
  const [stats, setStats] = useState({ characters: 0, words: 0, lines: 0 });
  
  const setPasswordStable = useCallback((val: string) => setPassword(val), []);
  const setDurationStable = useCallback((val: number) => setDuration(val), []);
  const setLanguageStable = useCallback((val: string) => {
  const lang = SUPPORTED_LANGUAGES.find(l => l.value === val);
    if (lang) setSelectedLanguage(lang);
  }, []);
  
  

  const handleEditorChange = useCallback((val: string) => {
    setTextContent(val);
    setStats({
      characters: val.length,
      words: val.trim().split(/\s+/).filter(Boolean).length,
      lines: val.split('\n').length,
    });
  }, []);

  const clearContent = () => {
    setTextContent("");
    handleEditorChange("");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Add API logic here
    setIsSubmitting(false);
  };

  return {
    state: { textContent, password, selectedLanguage, duration, stats, isSubmitting },
    setters: { 
      setPassword: setPasswordStable, 
      setSelectedLanguage: setLanguageStable, 
      setDuration: setDurationStable 
    },
    actions: { handleEditorChange, clearContent, handleSubmit }
  };
};
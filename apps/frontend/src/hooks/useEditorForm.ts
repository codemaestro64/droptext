import { useState, useCallback } from "react";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@repo/config";
import { insertPasteSchema, type InsertPaste } from "@repo/db-schema"
import { encryptText } from "../utils/encryption";

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
  selectedLanguage: LanguageOption;
  duration: number;
  stats: EditorStats;
}

export interface Payload {
  payload: InsertPaste;
  hashSecret: string
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
    preparePayload: () => Promise<Payload>
  };
}

export const useEditorForm = (): EditorFormReturn => {
  const [textContent, setTextContent] = useState('');
  const [password, setPassword] = useState('');
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
    setPassword("")
    setDuration(0)
    handleEditorChange("");
  };

  const preparePayload = async (): Promise<Payload> => {
    const data: InsertPaste = {
      content: textContent.trim(),
      language: selectedLanguage.value,
      duration: duration,
      hasPassword: !!password.trim(),
    }

    const parsed = insertPasteSchema.safeParse(data)
    if (!parsed.success) {
      throw parsed.error.flatten().fieldErrors
    }

    const { cipherText, hashSecret } = await encryptText(data.content, password);

    const payload = {
      ...data,
      content: cipherText
    }

    return { payload, hashSecret }
  }

  return {
    state: { textContent, password, selectedLanguage, duration, stats },
    setters: { 
      setPassword: setPasswordStable, 
      setSelectedLanguage: setLanguageStable, 
      setDuration: setDurationStable 
    },
    actions: { handleEditorChange, clearContent, preparePayload }
  };
};
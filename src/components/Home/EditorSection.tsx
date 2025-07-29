'use client'

import {  ChangeEvent, useState } from "react";
import { 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE, 
  EXPIRATION_OPTIONS 
} from "@/config";
import TextEditor from "../TextEditor"
import SelectInput from "../SelectInput";
import TextInput from "../TextInput";

const languageOptions = SUPPORTED_LANGUAGES.map(({ value, label }) => ({ value, label }))
const expirationOptions = EXPIRATION_OPTIONS.map(({ value, label }) => ({ value, label }))
const defaultLanguageOption = SUPPORTED_LANGUAGES.find(lang => lang.value === DEFAULT_LANGUAGE)

const EditorSection = () => {
  const [textContent, setTextContent] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguageOption ? defaultLanguageOption : SUPPORTED_LANGUAGES[0])
  const [expiration, setExpiration] = useState<number>(0) // 0 means expire after first reading
  const [stats, setStats] = useState({ characters: 0, words: 0, lines: 0 });
  
  const handleEditorChange = (val: string) => {
    setTextContent(val);

    const characters = val.length;
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    const lines = val.split('\n').length;

    setStats({ characters, words, lines });
  }

  const handleLanguageChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = SUPPORTED_LANGUAGES.find(lang => lang.value === evt.target.value)
    if (!selectedLang) {
      return
    }

    setSelectedLanguage(selectedLang)
  }

  const handleExpirationOptionChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    // validate selected expiration option
    const selectedExpiration = Number(evt.target.value)
    if (!EXPIRATION_OPTIONS.find(opt => opt.value === selectedExpiration)) {
      return 
    }

    setExpiration(selectedExpiration)
  }

  const clearEditorContent = () => {
    setTextContent("")
    handleEditorChange("")
  }

  const handleSubmit = () => {
    
  }
  
  return (
    <section className="card backdrop-blur-lg rounded-2xl shadow-2xl border-color overflow-hidden mb-8">
      <div className="card-header border-b border-color p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-row gap-2">
            
            <TextInput 
              type="password"
              placeholder="Optional password"
            />
          </div>
          <div className="flex flex-row gap-2">
            <SelectInput 
              onChange={handleLanguageChange}
              value={selectedLanguage?.value}
              options={languageOptions}
            />
            <SelectInput 
              onChange={handleExpirationOptionChange}
              value={expiration}
              options={expirationOptions}
            />
          </div>
        </div>
      </div>
      <div className="card-body">
        <TextEditor 
          extension={selectedLanguage?.extension}
          value={textContent}
          onChange={handleEditorChange}
        />
      </div>
      <div className="card-header border-t border-color p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted">
            <span>Lines: {stats.lines}</span>
            <span>Characters: {stats.characters}</span>
            <span>Words: {stats.words}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={clearEditorContent}
              disabled={!stats.characters}
              className="input-bg hover:opacity-80 text-primary px-4 py-2 rounded-lg border border-color disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>

            <button
              disabled={!stats.characters}
              onClick={handleSubmit}
              className="btn-primary text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Paste
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EditorSection
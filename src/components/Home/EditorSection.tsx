'use client'

import {  ChangeEvent, useState } from "react";
import TextEditor from "../TextEditor"
import SelectInput from "../SelectInput";
import { SUPPORTED_LANGUAGES, EXPIRES_OPTS } from "@/config";
import TextInput from "../TextInput";

const languageOptions = SUPPORTED_LANGUAGES.map(({ value, label }) => ({ value, label }))
const expirationOptions = EXPIRES_OPTS.map(({ value, label }) => ({ value, label }))

const EditorSection = () => {
  const [value, setValue] = useState('');
  const [stats, setStats] = useState({ characters: 0, words: 0, lines: 0 });
  
  const handleEditorChange = (val: string) => {
    setValue(val);

    const characters = val.length;
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    const lines = val.split('\n').length;

    setStats({ characters, words, lines });
  }

  const handleLanguageChange = (ev: ChangeEvent<HTMLSelectElement>) => {

  }

  const handleExpirationOptionChange = (ev: ChangeEvent<HTMLSelectElement>) => {

  }

  const clearEditorContent = () => {
    setValue("")
    handleEditorChange("")
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
              value={SUPPORTED_LANGUAGES[0].value}
              options={languageOptions}
            />
            <SelectInput 
              onChange={handleExpirationOptionChange}
              options={expirationOptions}
            />
          </div>
        </div>
      </div>
      <div className="card-body">
        <TextEditor 
          value={value}
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
              className="input-bg hover:opacity-80 text-primary px-4 py-2 rounded-lg transition-colors border border-color disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>

            <button
              disabled={!stats.characters}
              className="btn-primary text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
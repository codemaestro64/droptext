'use client'

import {  ChangeEvent, useState } from "react";
import { Send, Delete } from "lucide-react";
import { toast } from "react-toastify"
import { 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE, 
  EXPIRATION_OPTIONS 
} from "@/config";
import TextEditor from "../TextEditor"
import SelectInput from "../SelectInput";
import TextInput from "../TextInput";
import { decryptText, encryptText } from "@/utils/encryption";

const languageOptions = SUPPORTED_LANGUAGES.map(({ value, label }) => ({ value, label }))
const expirationOptions = EXPIRATION_OPTIONS.map(({ value, label }) => ({ value, label }))
const defaultLanguageOption = SUPPORTED_LANGUAGES.find(lang => lang.value === DEFAULT_LANGUAGE)

const EditorSection = () => {
  const [textContent, setTextContent] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguageOption ? defaultLanguageOption : SUPPORTED_LANGUAGES[0])
  const [expiration, setExpiration] = useState<number>(0) // 0 means expire after first reading
  const [stats, setStats] = useState({ characters: 0, words: 0, lines: 0 });
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
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

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const { cipherText, hashSecret } = encryptText(textContent.trim(), password);
      const response = await fetch("/api/paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: cipherText,
          language: selectedLanguage.value,
          expiration: expiration,
          hasPassword: !!password.trim(),
        }),
      });

      if (!response.ok) {
        let message = `Error ${response.status} - ${response.statusText}`;

        try {
          const data = await response.json();
          if (typeof data === 'object' && data?.error) {
            message = data.error;
          }
        } catch {}
        throw new Error(message);
      }

      const { id } = await response.json();
      toast.success("Paste created!");
      // You can redirect to /paste/${id} or similar here
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <section className="card backdrop-blur-lg rounded-2xl shadow-2xl border-color overflow-hidden mb-8">
      <div className="card-header border-b border-color p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-row gap-2">
            
            <TextInput 
              type="password"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
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
              className="input-bg hover:opacity-80 text-primary px-4 flex items-center justify-center space-x-2  py-2 rounded-lg border border-color disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Delete className="w-4 h-4" />
              <span>Clear</span>
            </button>

            <button
              disabled={isSubmitting || !stats.characters}
              onClick={handleSubmit}
              className="btn-primary text-white px-6 py-2 flex items-center justify-center space-x-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EditorSection
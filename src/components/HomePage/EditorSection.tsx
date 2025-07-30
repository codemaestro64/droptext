'use client'

import { useCallback, useState, ChangeEvent } from "react";
import { Send, Delete } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, DURATION_OPTIONS } from "@/config";
import { encryptText } from "@/utils/encryption";
import { pasteSchema } from "@/schemas/paste.schema";
import { PasteValidationError } from "@/utils/errors";

import TextEditor from "../TextEditor";
import SelectInput from "../SelectInput";
import TextInput from "../TextInput";
import { useFlash } from "@/hooks/useFlash";
import { uuidSecretToSlug } from "@/utils";


const languageOptions = SUPPORTED_LANGUAGES.map(({ value, label }) => ({ value, label }));
const durationOptions = DURATION_OPTIONS.map(({ value, label }) => ({ value, label }));
const defaultLanguageOption = SUPPORTED_LANGUAGES.find(lang => lang.value === DEFAULT_LANGUAGE) || SUPPORTED_LANGUAGES[0];

const EditorSection = () => {
  const [textContent, setTextContent] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguageOption);
  const [duration, setDuration] = useState<number>(0); // 0 = burn after read
  const [stats, setStats] = useState({ characters: 0, words: 0, lines: 0 });
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter()
  const { setFlash } = useFlash()

  const updateStats = useCallback((content: string) => {
    setStats({
      characters: content.length,
      words: content.trim().split(/\s+/).filter(Boolean).length,
      lines: content.split('\n').length,
    });
  }, []);

  const handleEditorChange = (val: string) => {
    setTextContent(val);
    updateStats(val);
  };

  const handleLanguageChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.value === evt.target.value);
    if (lang) setSelectedLanguage(lang);
  };

  const handleDurationChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(evt.target.value);
    if (DURATION_OPTIONS.some(opt => opt.value === value)) setDuration(value);
  };

  const clearEditorContent = () => {
    setTextContent("");
    updateStats("");
  };

  const preparePayload = () => {
    const content = textContent.trim();
    const data = {
      content,
      language: selectedLanguage.value,
      duration,
      hasPassword: !!password.trim(),
    };

    const parsed = pasteSchema.safeParse(data);
    if (!parsed.success) throw new PasteValidationError(parsed.error.issues);

    const { cipherText, hashSecret } = encryptText(content, password);
    const payload = {
      ...data,
      content: cipherText
    }
    
    return { payload, hashSecret };
  };

  const submitPaste = async () => {
    const { payload, hashSecret } = preparePayload();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paste`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let message = `Error ${res.status} - ${res.statusText}`;
      try {
        const data = await res.json();
        if (data?.error) message = data.error;
      } catch {}
      throw new Error(message);
    }

    const { uuid } = await res.json()
    return {
      uuid,
      hashSecret
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { uuid, hashSecret } = await submitPaste();
      toast.success("Paste created!");
      const to = `/view/${uuidSecretToSlug(uuid, hashSecret)}`
      setFlash(to)
      router.push(to)
    } catch (error) {
      if (error instanceof PasteValidationError) {
        error.issues.forEach((issue) => toast.error(issue.message));
      } else {
        toast.error(error instanceof Error ? error.message : "Unexpected error");
      }
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Optional password"
            />
          </div>
          <div className="flex flex-row gap-2">
            <SelectInput
              value={selectedLanguage.value}
              onChange={handleLanguageChange}
              options={languageOptions}
            />
            <SelectInput
              value={duration}
              onChange={handleDurationChange}
              options={durationOptions}
            />
          </div>
        </div>
      </div>

      <div className="card-body">
        <TextEditor
          language={selectedLanguage.value}
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
              className="input-bg hover:opacity-80 text-primary px-4 py-2 rounded-lg border border-color flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Delete className="w-4 h-4" />
              <span>Clear</span>
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !stats.characters}
              className="btn-primary text-white px-6 py-2 rounded-lg flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorSection;

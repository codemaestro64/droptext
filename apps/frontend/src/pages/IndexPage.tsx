import { useRef, useState } from "react";
import { Zap, ShieldCheck, Code, Delete, Send } from "lucide-react";
import { SUPPORTED_LANGUAGES, DURATION_OPTIONS } from "@repo/config";
import { useEditorForm } from "../hooks/useEditorForm";
import { uuidSecretToSlug } from "../utils";

import PasteLinkModal from "../components/modals/PasteLinkModal";
import TextInput from "../components/TextInput";
import SelectInput from "../components/SelectInput";
import CodeEditor from "../components/CodeEditor";
import { useToast } from "../hooks/useToast";
import { savePaste } from "../services/pasteService";

interface Feature {
  icon: React.ReactNode
  title: string 
  content: string
}

const FEATURES: Feature[] = [
  {
    icon: <ShieldCheck className="text-green-600 w-6 h-6" />,
    title: "Secure & Private",
    content: "Your code is encrypted and stored securely. Choose from public, unlisted, or private visibility options.",
  },
  {
    icon: <Code className="text-brown-500 w-6 h-6" />,
    title: "Syntax Highlighting",
    content: "Beautiful syntax highlighting for 100+ programming languages with multiple themes to choose from.",
  },
  {
    icon: <Zap className="text-yellow-500 w-6 h-6" />,
    title: "Lightning Fast",
    content: "Instant sharing with short URLs, API access, and real-time collaboration features.",
  },
]

const FeatureCard = ({ icon, title, content }: Feature) => (
  <div className="card rounded-xl p-6 py-8 border-color bg-base-200">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 input-bg rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
    </div>
    <p className="text-secondary">{content}</p>
  </div>
);

const IndexPage = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { state, setters, actions } = useEditorForm();
  const pasteLinkModalRef = useRef<HTMLDialogElement>(null);
  const [pasteLink, setPasteLink] = useState<string | undefined>(undefined);
  const { showToast } = useToast() 

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const { payload, hashSecret } = await actions.preparePayload()
      const res = await savePaste(payload)
      
      if (!res.success) {
        showToast(res.error, "error")
        return 
      }

      const slug = uuidSecretToSlug(res.data.uuid, hashSecret)
      setPasteLink(`${window.location.origin}/view/${slug}`)
      pasteLinkModalRef.current?.showModal();
      actions.clearContent();
    } catch (err) {
      showToast(`Error preparing payload: ${err}`, "error")
    } finally {
      setIsSubmitting(false)
    }
  };

  const handleCloseModal = () => {
    pasteLinkModalRef.current?.close();
    setPasteLink(undefined);
  };

  return (
    <>
      <PasteLinkModal 
        ref={pasteLinkModalRef} 
        onClose={handleCloseModal} 
        link={pasteLink}
      />
      <div className="py-6 space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary mb-4">Share Text Privately</h2>
          <p className="text-xl text-secondary">A modern, secure, and elegant way to share snippets</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="border border-secondary/20 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
            {/* Toolbar */}
            <div className="border-b border-secondary/20 p-4 flex flex-col sm:flex-row gap-4 justify-between">
              <TextInput 
                type="password" 
                value={state.password} 
                onChange={(e) => setters.setPassword(e.target.value)} 
                placeholder="Optional password" 
              />
              <div className="flex gap-2">
                <SelectInput 
                  value={state.selectedLanguage.value} 
                  options={SUPPORTED_LANGUAGES} 
                  onChange={(e) => setters.setSelectedLanguage(e.target.value)} 
                />
                <SelectInput 
                  className="w-90"
                  value={state.duration} 
                  options={DURATION_OPTIONS} 
                  onChange={(e) => setters.setDuration(Number(e.target.value))} 
                />
              </div>
            </div>

            <CodeEditor 
              language={state.selectedLanguage.value} 
              value={state.textContent} 
              onChange={actions.handleEditorChange} 
            />
        
            {/* Footer */}
            <div className="border-t border-secondary/20 p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex gap-4 text-sm text-muted">
                <span>Lines: {state.stats.lines}</span>
                <span>Words: {state.stats.words}</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={actions.clearContent} 
                  disabled={!state.stats.characters} 
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Delete className="w-4 h-4" /> <span>Clear</span>
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !state.stats.characters} 
                  className="btn btn-secondary flex items-center gap-2" 
                >
                  <Send className="w-4 h-4" /> <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexPage
import { useEffect, useState, useRef, useMemo } from "react";
import { Copy } from "lucide-react";
import { useParams } from "react-router-dom";
import { motion, type Variants } from "framer-motion"; 
import PastePasswordModal from "../components/modals/PastePasswordModal.js";
import CodeEditor from "../components/CodeEditor.js";
import { uuidSecretFromSlug, dateToString, getTimeRemaining } from "../utils/index.js";
import { SUPPORTED_LANGUAGES } from "@repo/config";
import PageError from "../components/PageError"
import { usePaste } from "../hooks/usePaste.js";
import { useDecryptPaste } from "../hooks/useDecryptPaste.js";
import { useToast } from "../hooks/useToast.js";

 const containerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

const editorVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.4, delay: 0.1 } 
  }
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <span className="loading loading-dots loading-lg text-primary" />
  </div>
);

const ViewPastePage = () => {
  const { slug } = useParams<{ slug: string }>();

  const decodedSlug = decodeURIComponent(slug || "");
  const { uuid, hashSecret } = uuidSecretFromSlug(decodedSlug);

  const { showToast } = useToast()
  const [, setCopied] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState("");
  const { pasteResult, isLoadingPaste } = usePaste(uuid)
  const decryptPaste = useDecryptPaste()

  useEffect(() => {
    if (!pasteResult?.success) return;
    const paste = pasteResult.data;

    if (paste.hasPassword) {
      modalRef.current?.show();
      return;
    }

  const isActive = { current: true };
  const runDecrypt = async () => {
    const text = await decryptPaste(paste, hashSecret, ""); 
    if (isActive && text !== null) {
      setDecryptedContent(text);
    }
  };

  runDecrypt();

  return () => {
    isActive.current = false;
  };
}, [pasteResult, hashSecret, decryptPaste]);

  const languageLabel = useMemo(() => {
    const langValue = pasteResult?.success ? pasteResult.data.language : null;
    if (!langValue) return "Plain Text";
    return SUPPORTED_LANGUAGES.find((lang) => lang.value === langValue)?.label || "Plain Text";
  }, [pasteResult]);

  const handlePasswordSubmit = async (password: string) => {
    if (!pasteResult?.success) return;
    setIsSubmittingPassword(true);
    const content = await decryptPaste(pasteResult.data, hashSecret, password);
    setDecryptedContent(content)
    setIsSubmittingPassword(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(decryptedContent);
      setCopied(true);
      showToast("Copied!", "success")
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      showToast(`Copy error: ${err}`, "error")
    }
  }

  if (isLoadingPaste) return <LoadingSpinner />;

  if (!pasteResult?.success) return <PageError errMsg={pasteResult?.error as string} />;

  const data = pasteResult?.data;
 
  return (
    <>
      {(data.hasPassword  && !decryptedContent) ? (
        <PastePasswordModal
          ref={modalRef}
          isSubmitting={isSubmittingPassword}
          onSubmit={handlePasswordSubmit}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 overflow-x-hidden">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Viewing Paste</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm text-base-content/70">
                <span className="flex items-center gap-2">
                  Created: <strong>{dateToString(new Date(data.createdAt))}</strong>
                </span>
                <span className="flex items-center gap-2">
                  Expires: <strong className="text-warning">{data.expiresAt ? getTimeRemaining(new Date(data.expiresAt)) : "Never"}</strong>
                </span>
              </div>
            </div>

            <div className="tooltip">
              <div className="tooltip-content">
                <div className="text-muted-foreground text-sm">Copy content</div>
              </div>
              <button 
                type="button" 
                title="Copy"
                className="btn btn-circle p-3"
                onClick={handleCopy}
              >
                <Copy size={20} />
              </button>
            </div>
            
          </motion.div>

          <motion.div
            variants={editorVariants}
            initial="hidden"
            animate="visible"
          >
            <CodeEditor
              language={data.language!}
              value={decryptedContent}
              editable={false}
              height="auto"
            >
              <span className="text-sm font-medium uppercase tracking-wider text-base-content/60">
                Language: <strong className="text-primary">{languageLabel}</strong>
              </span>
            </CodeEditor>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ViewPastePage;
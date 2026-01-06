import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { SelectPaste } from "@repo/db-schema";
import { fetchPaste } from "../services/pasteService";
import PastePasswordModal from "../components/modals/PastePasswordModal";
import CodeEditor from "../components/CodeEditor";
import { useToast } from "../hooks/useToast";
import { decryptText } from "../utils/encryption";
import type { AsyncResult } from "../types";
import { uuidSecretFromSlug, dateToString, getTimeRemaining } from "../utils";
import { SUPPORTED_LANGUAGES } from "@repo/config";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <span className="loading loading-dots loading-lg text-primary" />
  </div>
);

const ViewPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const decodedSlug = decodeURIComponent(slug || "");
  const { uuid, hashSecret } = uuidSecretFromSlug(decodedSlug);

  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pasteResult, setPasteResult] = useState<AsyncResult<SelectPaste> | null>(null);

  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (pasteResult?.success && pasteResult.data.hasPassword && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [pasteResult]);

  const handleDecrypt = async (targetData: SelectPaste, password = "") => {
    try {
      const decryptedText = await decryptText(targetData.content, hashSecret, password);

      setPasteResult({
        success: true,
        data: { ...targetData, hasPassword: false, content: decryptedText },
      });
      return true;
    } catch {
      showToast("Incorrect password. Please try again.", "error");
      return false;
    }
  };

  useEffect(() => {
    if (!uuid) {
      showToast("Invalid URL format", "error");
      navigate("/");
      return;
    }

    let isActive = true;

    const getPaste = async () => {
      setIsLoading(true);
      const res = await fetchPaste(uuid);
      if (!isActive) return;

      if (res.success) {
        if (res.data.hasPassword) {
          setPasteResult(res);
        } else {
          // If no password is set on the paste, attempt auto-decrypt using URL secret
          await handleDecrypt(res.data, "");
        }
      } else {
        setPasteResult(res);
      }
      setIsLoading(false);
    };

    getPaste();
    return () => { isActive = false; };
  }, [uuid, hashSecret, navigate, showToast]);

  const handlePasswordSubmit = async (password: string) => {
    if (!pasteResult?.success) return;
    setIsSubmittingPassword(true);
    await handleDecrypt(pasteResult.data, password);
    setIsSubmittingPassword(false);
  };

  const data = pasteResult?.success ? pasteResult.data : null;
  const languageLabel = useMemo(() => {
    if (!data) return "Unknown";
    return SUPPORTED_LANGUAGES.find((lang) => lang.value === data.language)?.label || "Plain Text";
  }, [data]);

  const stats = useMemo(() => {
    if (!data?.content) return { chars: 0, lines: 0, words: 0 };
    return {
      chars: data.content.length,
      lines: data.content.split("\n").length,
      words: data.content.trim().split(/\s+/).filter(Boolean).length,
    };
  }, [data]);

  if (isLoading) return <LoadingSpinner />;

  if (!pasteResult || !pasteResult.success || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{pasteResult?.error || "Failed to load paste"}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {data.hasPassword ? (
        <PastePasswordModal
          ref={modalRef}
          isSubmitting={isSubmittingPassword}
          onSubmit={handlePasswordSubmit}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 min-h-screen">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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
          </div>

          <div className="border border-base-content/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden mb-8">
            <div className="bg-base-200/50 border-b border-base-content/10 p-3 px-7 flex justify-between items-center">
              <span className="text-sm font-medium uppercase tracking-wider text-base-content/60">
                Language: <strong className="text-primary">{languageLabel}</strong>
              </span>
            </div>

            <CodeEditor
              language={data.language}
              value={data.content}
              editable={false}
              height="auto"
            />

            <div className="bg-base-200/30 border-t border-base-content/10 flex flex-col sm:flex-row gap-4 justify-between items-center p-3 px-7">
              <div className="flex gap-6 text-xs font-mono text-base-content/50">
                <span>CHARS: {stats.chars}</span>
                <span>LINES: {stats.lines}</span>
                <span>WORDS: {stats.words}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewPage;
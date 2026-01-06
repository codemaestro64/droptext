import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ToastContext, type Toast } from "../context/ToastContext";

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast["type"] = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);

    // remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed top-5 right-5 flex flex-col gap-2 z-[9999] pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`alert shadow-lgs pointer-events-auto animate-in fade-in slide-in-from-right-5  ${
                t.type === "success"
                  ? "alert-success"
                  : t.type === "error"
                  ? "alert-error"
                  : "alert-info"
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>,
        document.body
      )}

    </ToastContext.Provider>
  );
};

import { forwardRef } from "react";
import { Check } from "lucide-react";

interface PasteLinkModalProps {
  link?: string; // optional, only set when opened
  onClose?: () => void;
}

const PasteLinkModal = forwardRef<HTMLDialogElement, PasteLinkModalProps>(
  ({ link, onClose }, ref) => {
    const handleCopy = async () => {
      if (!link) return;
      try {
        await navigator.clipboard.writeText(link);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    };

    return (
      <dialog
        ref={ref}
        className="modal"
        aria-label="Paste Created Modal"
      >
        <div className="modal-box bg-base-200 p-6 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Check className="text-white" size={48} />
            </div>
          </div>

          {/* Title & Message */}
          <h3 className="text-2xl font-bold mb-2">Paste Created!</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your paste is ready to share
          </p>

          {/* Link Display (only when available) */}
          {link ? (
            <div className="bg-base-100 rounded-md text-left p-4 mb-4 break-all">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {link}
              </a>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground mb-4">
              No link available
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <button
              className="btn btn-secondary btn-lg"
              onClick={handleCopy}
              disabled={!link}
            >
              Copy Link
            </button>
            <button
              className="btn btn-error btn-lg"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    );
  }
);

PasteLinkModal.displayName = "PasteLinkModal";

export default PasteLinkModal;

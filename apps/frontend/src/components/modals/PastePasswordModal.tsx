import { forwardRef, useState } from "react";
import { Lock } from "lucide-react";
import TextInput from "../TextInput";

interface PastePasswordModalProps {
  isSubmitting: boolean;
  onSubmit: (password: string) => void;
}

const PastePasswordModal = forwardRef<HTMLDialogElement, PastePasswordModalProps>(
  ({ isSubmitting, onSubmit }, ref) => {
    
    const [password, setPassword] = useState("")

    const handleSubmit = () => {
      onSubmit(password.trim())
    }
    
    return (
      <dialog 
        ref={ref}
        className="modal"
        aria-label="Paste Password Modal"
      >
        <div className="modal-box bg-base-200 py-15 px-10">
          {/*Protected Icon*/}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <Lock className="text-white" size={48} />
            </div>
          </div>

          {/* Title and Message */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Protected Paste</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This paste is password protected
            </p>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <TextInput 
              type="password" 
              placeholder="Enter Password" 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Action Button */}
          <div className="mb-4">
            <button 
              className="btn btn-secondary btn-lg w-full"
              disabled={isSubmitting || !password}
              onClick={handleSubmit}
            >
                Submit
              </button>
          </div>
        </div>
      </dialog>
    );
  }
);

export default PastePasswordModal
import { createContext } from "react";

export interface Toast {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
}

export interface ToastContextValue {
  showToast: (message: string, type?: Toast["type"]) => void;
}


export const ToastContext = createContext<ToastContextValue | undefined>(undefined);
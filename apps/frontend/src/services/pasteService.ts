import type { InsertPaste, SelectPaste } from "@repo/db-schema";
import type { AsyncResult } from "../types/index.js"

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Maps HTTP status codes to user-friendly error messages
 */
const getErrorMessage = (status: number, serverMsg?: string): string => {
  switch (status) {
    case 401: return "Paste has expired.";
    case 404: return "We couldn't find that paste. It might have been deleted.";
    case 500: return "A server error occurred";
    default: return serverMsg || "An unexpected error occurred.";
  }
};

export const fetchPaste = async (uuid: string): Promise<AsyncResult<SelectPaste>> => {
  try {
    const res = await fetch(`${BASE_URL}/paste/${uuid}`);
    const data = await res.json();

    if (!res.ok) {
      return { 
        success: false, 
        error: getErrorMessage(res.status, data?.error),
        status: res.status 
      };
    }

    return { success: true, data: data as SelectPaste };
  } catch {
    return { success: false, error: "Network error. Please check your connection." };
  }
};

export const savePaste = async (payload: InsertPaste): Promise<AsyncResult<{ uuid: string }>> => {
  try {
    const res = await fetch(`${BASE_URL}/paste`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return { 
        success: false, 
        error: getErrorMessage(res.status, data?.error),
        status: res.status 
      };
    }

    return { success: true, data: data as { uuid: string } };
  } catch {
    return { success: false, error: "Failed to reach the server. Try again later." };
  }
};
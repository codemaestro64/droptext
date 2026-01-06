import { decryptText } from "../utils/encryption.js";
import { useToast } from "./useToast.js";
import { useCallback } from "react";
import type { SelectPaste } from "@repo/db-schema";

export const useDecryptPaste = () => {
  const { showToast } = useToast();

  const decryptPaste = useCallback(
    async (
      paste: SelectPaste,
      hashSecret: string,
      password: string = "",
    ): Promise<string> => {
      try {
        return await decryptText(paste.content, hashSecret, password);
      } catch {
        showToast("Incorrect password or failed to decrypt paste.", "error");
        return "";
      }
    },
    [showToast]
  );

  return decryptPaste;
};

import { useMutation } from "@tanstack/react-query";
import type { InsertPaste } from "@repo/db-schema";
import { createPaste } from "../services/pasteService";

export const useCreatePaste = () => {
  return useMutation({
    mutationFn: async (params: { preparePayload: () => Promise<{ payload: InsertPaste, hashSecret: string}> }) => {
      const { payload, hashSecret } = await params.preparePayload();
      const { uuid } = await createPaste(payload);
      
      return { uuid, hashSecret };
    }
  });
};
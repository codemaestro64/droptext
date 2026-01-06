// hooks/usePaste.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { InsertPaste, SelectPaste } from "@repo/db-schema";
import type { AsyncResult } from "../types";
import { fetchPaste, savePaste } from "../services/pasteService";

export const usePaste = (uuid?: string | null) => {
  const queryClient = useQueryClient();

  const pasteQuery = useQuery<AsyncResult<SelectPaste>>({
    queryKey: ["paste", uuid],
    queryFn: () => fetchPaste(uuid!),
    enabled: !!uuid,   
    gcTime: 5 * 60_000,    
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60,  
  });

  const createPasteMutation = useMutation<
    AsyncResult<{ uuid: string }>,
    never,
    InsertPaste
  >({
    mutationFn: savePaste,

    onSuccess: (result) => {
      if (!result.success) return;
      queryClient.setQueryData(
        ["paste", result.data.uuid],
        result
      );
    },
  });

  return {
    pasteResult: pasteQuery.data,
    isLoadingPaste: pasteQuery.isLoading,
    isFetchingPaste: pasteQuery.isFetching,
    refetchPaste: pasteQuery.refetch,
    createPaste: createPasteMutation.mutateAsync,
    isCreatingPaste: createPasteMutation.isPending,
    pasteQuery,
    createPasteMutation,
  };
};

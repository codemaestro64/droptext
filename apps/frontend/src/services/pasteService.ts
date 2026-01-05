import type { InsertPaste } from "@repo/db-schema";

export const createPaste = async (payload: InsertPaste) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/paste`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || `Server Error: ${response.status}`);
  }

  return data as { uuid: string };
};
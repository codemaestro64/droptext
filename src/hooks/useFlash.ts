// hooks/useFlash.ts
import { useState, useEffect } from 'react';

export function useFlash(key: string = 'flash') {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const flash = sessionStorage.getItem(key);
    if (flash) {
      setMessage(flash);
      sessionStorage.removeItem(key);
    }
  }, [key]);

  const setFlash = (msg: string) => {
    sessionStorage.setItem(key, msg);
  };

  return { message, setFlash };
}

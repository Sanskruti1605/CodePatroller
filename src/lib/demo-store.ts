import { useEffect, useState } from "react";

/** Simple localStorage-backed state for demo changes. Loads after mount to stay SSR-safe. */
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [key]);
  useEffect(() => {
    if (loaded) localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, loaded]);
  return [value, setValue] as const;
}

export function useFindingStatuses() {
  return useLocalState<Record<string, "open" | "resolved" | "dismissed">>("cp-finding-status", {});
}

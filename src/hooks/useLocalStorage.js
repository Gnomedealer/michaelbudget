import { useEffect, useState } from "react";

// Like useState, but the value is saved in the browser so it
// survives page refreshes.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be full or blocked (private mode). The app still
      // works for this visit; it just won't remember the data.
    }
  }, [key, value]);

  return [value, setValue];
}

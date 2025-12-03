import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "storage",
      (event) => {
        if (
          event.key === null &&
          event.newValue === null &&
          event.oldValue === null
        ) {
          setValue(initialValue);
        }

        if (event.key === key && event.newValue != null) {
          setValue(JSON.parse(event.newValue));
        }
      },
      {
        signal: controller.signal,
      }
    );

    return () => {
      controller.abort();
    };
  }, []);

  return [value, setValue];
}

import { useState, useEffect, useRef } from 'react';

function useDebounce(value: number | number, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const handler = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    handler.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (handler.current) {
        clearTimeout(handler.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

import { useState, useEffect } from 'react';

const useURLChange = () => {
  const [search, setSearch] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleURLChange = () => {
        setSearch(window.location.search);
      };

      setSearch(window.location.search);

      const interval = setInterval(handleURLChange, 100);

      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  return search;
};

export default useURLChange;

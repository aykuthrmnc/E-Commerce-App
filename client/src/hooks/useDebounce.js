import { useEffect, useState } from "react";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(debouncedValue);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value]);

  return debouncedValue;
};

export default useDebounce;

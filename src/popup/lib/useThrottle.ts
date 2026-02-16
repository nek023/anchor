import { useEffect, useRef, useState } from "react";

// https://github.com/streamich/react-use/blob/325f5bd69904346788ea981ec18bfc7397c611df/src/useThrottle.ts
export const useThrottle = <T>(value: T, ms = 200) => {
  const [currentValue, setCurrentValue] = useState<T>(value);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const nextValue = useRef<T>(value);
  const hasNextValue = useRef(false);

  useEffect(() => {
    if (!timeout.current) {
      setCurrentValue(value);
      const timeoutCallback = () => {
        if (hasNextValue.current) {
          hasNextValue.current = false;
          setCurrentValue(nextValue.current);
          timeout.current = setTimeout(timeoutCallback, ms);
        } else {
          timeout.current = undefined;
        }
      };
      timeout.current = setTimeout(timeoutCallback, ms);
    } else {
      nextValue.current = value;
      hasNextValue.current = true;
    }
  }, [value, ms]);

  useEffect(() => () => timeout.current && clearTimeout(timeout.current), []);

  return currentValue;
};

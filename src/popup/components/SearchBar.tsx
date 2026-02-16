import React, { useCallback, useEffect, useRef } from "react";

interface SearchBarProps {
  value: string;
  onValueChange?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onValueChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = useCallback(() => inputRef?.current?.focus(), []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onValueChange == null) return;
      onValueChange(event.target.value);
    },
    [onValueChange],
  );

  useEffect(
    () => {
      // Move cursor to the end
      inputRef?.current?.setSelectionRange(value.length, value.length);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <input
      className="w-full p-1 rounded-sm border border-gray-300 text-2xl focus:outline-hidden"
      type="text"
      title="query"
      value={value}
      ref={inputRef}
      autoFocus={true}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};

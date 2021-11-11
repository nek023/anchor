import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

const SearchBarInput = styled.input`
  width: 100%;
  height: 40px;
  margin: 0;
  padding: 5px;
  font-size: 26px;
  border-radius: 4px;
  border: 1px solid #cccccc;

  &:focus {
    outline: none;
  }
`;

interface SearchBarProps {
  value: string;
  onValueChange?: (value: string) => void;
}

export const SearchBar: React.VFC<SearchBarProps> = ({
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
    [onValueChange]
  );

  useEffect(
    () => {
      // Move cursor to the end
      inputRef?.current?.setSelectionRange(value.length, value.length);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <SearchBarInput
      type="text"
      value={value}
      ref={inputRef}
      autoFocus={true}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};

import React, { useCallback, useEffect } from "react";

const Code = {
  ArrowDown: "ArrowDown",
  ArrowUp: "ArrowUp",
  Enter: "Enter",
  Escape: "Escape",
  KeyN: "KeyN",
  KeyP: "KeyP",
};

interface KeyboardEventHandlerProps {
  onReturn: () => void;
  onEscape: () => void;
  onUp: () => void;
  onDown: () => void;
}

export const KeyboardEventHandler: React.FC<KeyboardEventHandlerProps> = ({
  children,
  onReturn,
  onEscape,
  onUp,
  onDown,
}) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case Code.ArrowDown:
          event.preventDefault();
          onDown();
          break;

        case Code.ArrowUp:
          event.preventDefault();
          onUp();
          break;

        case Code.Enter:
          event.preventDefault();
          onReturn();
          break;

        case Code.Escape:
          event.preventDefault();
          onEscape();
          break;

        case Code.KeyN:
          if (!event.ctrlKey) break;
          event.preventDefault();
          onDown();
          break;

        case Code.KeyP:
          if (!event.ctrlKey) break;
          event.preventDefault();
          onUp();
          break;

        default:
          break;
      }
    },
    [onDown, onEscape, onReturn, onUp]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return <React.Fragment>{children}</React.Fragment>;
};

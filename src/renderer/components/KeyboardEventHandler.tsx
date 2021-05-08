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
  onDown?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onUp?: () => void;
}

export const KeyboardEventHandler: React.FC<KeyboardEventHandlerProps> = ({
  children,
  onDown,
  onEnter,
  onEscape,
  onUp,
}) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case Code.ArrowDown:
          if (onDown == null) break;
          event.preventDefault();
          onDown();
          break;

        case Code.ArrowUp:
          if (onUp == null) break;
          event.preventDefault();
          onUp();
          break;

        case Code.Enter:
          if (onEnter == null) break;
          event.preventDefault();
          onEnter();
          break;

        case Code.Escape:
          if (onEscape == null) break;
          event.preventDefault();
          onEscape();
          break;

        case Code.KeyN:
          if (onDown == null || !event.ctrlKey) break;
          event.preventDefault();
          onDown();
          break;

        case Code.KeyP:
          if (onUp == null || !event.ctrlKey) break;
          event.preventDefault();
          onUp();
          break;

        default:
          break;
      }
    },
    [onDown, onEnter, onEscape, onUp]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return <>{children}</>;
};

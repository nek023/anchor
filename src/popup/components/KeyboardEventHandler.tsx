import React, { useCallback, useEffect } from "react";

const Code = {
  arrowDown: "ArrowDown",
  arrowUp: "ArrowUp",
  enter: "Enter",
  escape: "Escape",
  keyN: "KeyN",
  keyP: "KeyP",
};

interface KeyboardEventHandlerProps {
  children?: React.ReactNode;
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
      if (event.isComposing) return;

      switch (event.code) {
        case Code.arrowDown:
          if (onDown == null) break;
          event.preventDefault();
          onDown();
          break;

        case Code.arrowUp:
          if (onUp == null) break;
          event.preventDefault();
          onUp();
          break;

        case Code.enter:
          if (onEnter == null) break;
          event.preventDefault();
          onEnter();
          break;

        case Code.escape:
          if (onEscape == null) break;
          event.preventDefault();
          onEscape();
          break;

        case Code.keyN:
          if (onDown == null || !event.ctrlKey) break;
          event.preventDefault();
          onDown();
          break;

        case Code.keyP:
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

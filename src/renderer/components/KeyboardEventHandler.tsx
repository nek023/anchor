import React, { useCallback, useEffect } from 'react'

const KeyCode = {
  Return: 13,
  Escape: 27,
  Up: 38,
  Down: 40,
  N: 78,
  P: 80,
} as const

interface KeyboardEventHandlerProps {
  onReturn: () => void
  onEscape: () => void
  onUp: () => void
  onDown: () => void
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
      switch (event.keyCode) {
        case KeyCode.Return:
          event.preventDefault()
          onReturn()
          break

        case KeyCode.Escape:
          event.preventDefault()
          onEscape()
          break

        case KeyCode.Up:
          event.preventDefault()
          onUp()
          break

        case KeyCode.Down:
          event.preventDefault()
          onDown()
          break

        case KeyCode.P:
          if (!event.ctrlKey) break
          event.preventDefault()
          onUp()
          break

        case KeyCode.N:
          if (!event.ctrlKey) break
          event.preventDefault()
          onDown()
          break

        default:
          break
      }
    },
    [onDown, onEscape, onReturn, onUp]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return <React.Fragment>{children}</React.Fragment>
}

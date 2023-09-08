import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { KeyboardEventHandler } from "./KeyboardEventHandler";

describe("KeyboardEventHandler", () => {
  test("matches snapshot", () => {
    const { asFragment } = render(<KeyboardEventHandler />);

    expect(asFragment()).toMatchInlineSnapshot(`<DocumentFragment />`);
  });

  test("keyboard event handling", () => {
    const handleDown = jest.fn();
    const handleEscape = jest.fn();
    const handleReturn = jest.fn();
    const handleUp = jest.fn();
    const { container } = render(
      <KeyboardEventHandler
        onDown={handleDown}
        onEscape={handleEscape}
        onEnter={handleReturn}
        onUp={handleUp}
      >
        <input type="text" />
      </KeyboardEventHandler>,
    );

    const inputElement = container.firstChild;
    if (inputElement == null) throw "failed to get firstChild";
    fireEvent.focus(inputElement);

    // https://testing-library.com/docs/guide-events/#keydown
    const fireKeyDown = (options: { code: string; ctrlKey?: boolean }) =>
      fireEvent.keyDown(document.activeElement || document.body, options);

    fireKeyDown({ code: "ArrowDown" });
    expect(handleDown).toBeCalledTimes(1);

    fireKeyDown({ code: "KeyN", ctrlKey: true });
    expect(handleDown).toBeCalledTimes(2);

    fireKeyDown({ code: "ArrowUp" });
    expect(handleUp).toBeCalledTimes(1);

    fireKeyDown({ code: "KeyP", ctrlKey: true });
    expect(handleUp).toBeCalledTimes(2);

    fireKeyDown({ code: "Enter" });
    expect(handleReturn).toBeCalledTimes(1);

    fireKeyDown({ code: "Escape" });
    expect(handleEscape).toBeCalledTimes(1);
  });
});

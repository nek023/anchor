import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { KeyboardEventHandler } from "./KeyboardEventHandler";

describe("KeyboardEventHandler", () => {
  test("matches snapshot", () => {
    const { asFragment } = render(
      <KeyboardEventHandler
        onDown={() => {}}
        onEscape={() => {}}
        onReturn={() => {}}
        onUp={() => {}}
      />
    );

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
        onReturn={handleReturn}
        onUp={handleUp}
      >
        <input type="text" />
      </KeyboardEventHandler>
    );

    const inputElement = container.firstChild;
    if (inputElement == null) throw "failed to get firstChild";
    fireEvent.focus(inputElement);

    // https://testing-library.com/docs/guide-events/#keydown
    const fireKeyDown = (options: { keyCode: number; ctrlKey?: boolean }) =>
      fireEvent.keyDown(document.activeElement || document.body, options);

    fireKeyDown({ keyCode: 40 });
    expect(handleDown).toBeCalledTimes(1);

    fireKeyDown({ keyCode: 78, ctrlKey: true });
    expect(handleDown).toBeCalledTimes(2);

    fireKeyDown({ keyCode: 38 });
    expect(handleUp).toBeCalledTimes(1);

    fireKeyDown({ keyCode: 80, ctrlKey: true });
    expect(handleUp).toBeCalledTimes(2);

    fireKeyDown({ keyCode: 13 });
    expect(handleReturn).toBeCalledTimes(1);

    fireKeyDown({ keyCode: 27 });
    expect(handleEscape).toBeCalledTimes(1);
  });
});

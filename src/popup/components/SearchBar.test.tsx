import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  test("matches snapshot", () => {
    const { asFragment } = render(<SearchBar value="test" />);

    expect(asFragment()).toMatchSnapshot();
  });

  test("calls onValueChanged when the value has changed", () => {
    const handleValueChange = jest.fn();
    const { container } = render(
      <SearchBar value="test" onValueChange={handleValueChange} />,
    );

    const firstChild = container.firstChild;
    if (firstChild == null) throw "failed to get firstChild";

    fireEvent.change(firstChild, { target: { value: "new value" } });
    expect(handleValueChange).toBeCalledWith("new value");
  });

  test("has always been focused", () => {
    const { container } = render(<SearchBar value="test" />);

    const firstChild = container.firstChild;
    if (firstChild == null) throw "failed to get firstChild";

    expect(firstChild).toHaveFocus();

    fireEvent.blur(firstChild);
    expect(firstChild).toHaveFocus();
  });
});

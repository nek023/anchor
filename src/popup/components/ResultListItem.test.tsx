import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { BookmarkItem, ItemType } from "../../lib/types";
import { ResultListItem } from "./ResultListItem";

describe("ResultListItem", () => {
  const item: BookmarkItem = {
    id: "bookmark-1",
    type: ItemType.Bookmark,
    title: "test",
    url: "https://example.com",
  };

  test("matches snapshot", () => {
    const { asFragment } = render(
      <ResultListItem item={item} selected={false} />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test("calls onClick when it has been clicked", () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <ResultListItem item={item} selected={false} onClick={handleClick} />
    );

    fireEvent.click(getByText("test"));
    expect(handleClick).toBeCalledWith(item);
  });
});

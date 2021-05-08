import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { BookmarkItem, ItemType } from "../../common/types";
import { ResultList } from "./ResultList";

describe("ResultList", () => {
  const items: BookmarkItem[] = [
    {
      type: ItemType.Bookmark,
      title: "item1",
      url: "https://example.com",
    },
    {
      type: ItemType.Bookmark,
      title: "item2",
      url: "https://example.com",
    },
  ];

  test("matches snapshot", () => {
    const { asFragment } = render(
      <ResultList items={items} onItemClick={() => {}} selectedItemIndex={0} />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test("calls onClickItem when the item has been clicked", () => {
    const handleItemClick = jest.fn();
    const { getByText } = render(
      <ResultList
        items={items}
        onItemClick={handleItemClick}
        selectedItemIndex={0}
      />
    );

    fireEvent.click(getByText("item2"));
    expect(handleItemClick).toBeCalledWith(1);
  });
});

import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { BookmarkItem, ItemType } from "../../shared/types";
import { ResultList } from "./ResultList";

describe("ResultList", () => {
  const items: BookmarkItem[] = [
    {
      id: "bookmark-1",
      type: ItemType.Bookmark,
      title: "item1",
      url: "https://example.com",
    },
    {
      id: "bookmark-2",
      type: ItemType.Bookmark,
      title: "item2",
      url: "https://example.com",
    },
  ];

  beforeEach(() => {
    global.chrome = {
      runtime: {
        getURL: (path: string) => {
          return `chrome-extension://EXTENSION_ID${path}`;
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });

  test("matches snapshot", () => {
    const { asFragment } = render(
      <ResultList items={items} selectedItemIndex={0} />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test("calls onClickItem when the item has been clicked", () => {
    const handleItemClick = jest.fn();
    const { getByText } = render(
      <ResultList
        items={items}
        selectedItemIndex={0}
        onItemClick={handleItemClick}
      />
    );

    fireEvent.click(getByText("item2"));
    expect(handleItemClick).toBeCalledWith(1);
  });
});

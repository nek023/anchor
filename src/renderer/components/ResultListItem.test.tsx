import { shallow } from "enzyme";
import React from "react";
import { BookmarkItem, ItemType } from "../../common/types";
import { ResultListItem } from "./ResultListItem";

describe("ResultListItem", () => {
  let item: BookmarkItem;

  beforeEach(() => {
    item = {
      type: ItemType.Bookmark,
      title: "example",
      url: "https://example.com",
    };
  });

  it("matches snapshot", () => {
    const wrapper = shallow(
      <ResultListItem
        index={0}
        item={item}
        onClick={() => {}}
        selected={false}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("calls onClick when mouse has been clicked", () => {
    const handleClick = jest.fn();
    const wrapper = shallow(
      <ResultListItem
        index={0}
        item={item}
        onClick={handleClick}
        selected={false}
      />
    );

    expect(handleClick).not.toHaveBeenCalled();

    wrapper.simulate("click");

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

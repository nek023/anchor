import { Item, ItemType } from "../../shared/types";
import { ItemManager } from "./ItemManager";

describe("ItemManager", () => {
  const bookmarkLoaderMock = {
    get items(): Item[] {
      return [
        {
          id: "bookmark-1",
          type: ItemType.Bookmark,
          title: "bookmark",
          url: "https://example.com",
        },
      ];
    },
  };

  const historyLoaderMock = {
    get items(): Item[] {
      return [
        {
          id: "history-1",
          type: ItemType.History,
          title: "history",
          url: "https://example.com",
        },
      ];
    },
  };

  const manager = new ItemManager({
    b: bookmarkLoaderMock,
    h: historyLoaderMock,
  });

  describe("searchItems", () => {
    test("no filters", () => {
      const items = manager.searchItems("", "example");
      expect(items).toHaveLength(0);
    });

    test("one filter, one matched", () => {
      const items = manager.searchItems("b", "bookmark");
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("bookmark-1");
    });

    test("one filter, not matched", () => {
      const items = manager.searchItems("b", "history");
      expect(items).toHaveLength(0);
    });

    test("two filters, one matched", () => {
      const items = manager.searchItems("bh", "history");
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("history-1");
    });

    test("two filters, not matched", () => {
      const items = manager.searchItems("bh", "tab");
      expect(items).toHaveLength(0);
    });

    test("two filters, two matched", () => {
      const items = manager.searchItems("bh", "example");
      expect(items).toHaveLength(2);
      expect(items.map((item) => item.id)).toEqual(["bookmark-1", "history-1"]);
    });
  });
});

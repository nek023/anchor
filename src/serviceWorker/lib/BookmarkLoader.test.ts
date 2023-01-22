import { ItemType } from "../../lib/types";
import { BookmarkLoader } from "./BookmarkLoader";

describe("BookmarkLoader", () => {
  let onImportBeganCallback: () => void;
  let onImportEndedCallback: () => void;
  let onCreatedCallback: () => void;
  let onChangedCallback: () => void;
  let onRemovedCallback: () => void;
  const getRecentFunc = jest.fn();

  const mockGetRecent = (results: chrome.bookmarks.BookmarkTreeNode[]) => {
    getRecentFunc.mockImplementation(
      (
        numberOfItems: number,
        callback: (results: chrome.bookmarks.BookmarkTreeNode[]) => void
      ) => {
        callback(results);
      }
    );
  };

  beforeEach(() => {
    global.chrome = {
      bookmarks: {
        onImportBegan: {
          addListener: (callback: () => void) => {
            onImportBeganCallback = callback;
          },
        },
        onImportEnded: {
          addListener: (callback: () => void) => {
            onImportEndedCallback = callback;
          },
        },
        onCreated: {
          addListener: (callback: () => void) => {
            onCreatedCallback = callback;
          },
        },
        onChanged: {
          addListener: (callback: () => void) => {
            onChangedCallback = callback;
          },
        },
        onRemoved: {
          addListener: (callback: () => void) => {
            onRemovedCallback = callback;
          },
        },
        getRecent: getRecentFunc,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });

  afterEach(() => {
    getRecentFunc.mockReset();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).chrome;
  });

  describe("load", () => {
    test("returns items", () => {
      mockGetRecent([
        {
          id: "1",
          title: "test",
          url: "https://example.com",
        },
      ]);
      const loader = new BookmarkLoader();
      expect(loader.items).toEqual([
        {
          id: "bookmark-1",
          type: ItemType.Bookmark,
          title: "test",
          url: "https://example.com",
        },
      ]);
    });
  });

  describe("handling onCreated events", () => {
    test("items will be updated when onCreated event occurred", () => {
      const loader = new BookmarkLoader();
      mockGetRecent([
        {
          id: "1",
          title: "test",
          url: "https://example.com",
        },
      ]);
      expect(loader.items).toHaveLength(0);

      onCreatedCallback();
      expect(loader.items).toHaveLength(1);
    });

    test("items will not be updated when onCreated event occured during import", () => {
      const loader = new BookmarkLoader();
      mockGetRecent([
        {
          id: "1",
          title: "test",
          url: "https://example.com",
        },
      ]);
      expect(loader.items).toHaveLength(0);

      onImportBeganCallback();
      onCreatedCallback();
      expect(loader.items).toHaveLength(0);

      onImportEndedCallback();
      onCreatedCallback();
      expect(loader.items).toHaveLength(1);
    });
  });

  describe("handling onChanged events", () => {
    test("items will be updated when onChanged event occurred", () => {
      const loader = new BookmarkLoader();
      mockGetRecent([
        {
          id: "1",
          title: "test",
          url: "https://example.com",
        },
      ]);
      expect(loader.items).toHaveLength(0);

      onChangedCallback();
      expect(loader.items).toHaveLength(1);
    });
  });

  describe("handling onRemoved events", () => {
    test("items will be updated when onRemoved event occurred", () => {
      const loader = new BookmarkLoader();
      mockGetRecent([
        {
          id: "1",
          title: "test",
          url: "https://example.com",
        },
      ]);
      expect(loader.items).toHaveLength(0);

      onRemovedCallback();
      expect(loader.items).toHaveLength(1);
    });
  });
});

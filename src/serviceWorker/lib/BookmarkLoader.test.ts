import { ItemType } from "../../lib/types";
import { BookmarkLoader } from "./BookmarkLoader";

describe("BookmarkLoader", () => {
  let onImportBeganCallback: () => void;
  let onImportEndedCallback: () => void;
  let onCreatedCallback: () => void;
  let onChangedCallback: () => void;
  let onRemovedCallback: () => void;
  const getRecentMock = jest.fn();

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
        getRecent: getRecentMock,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });

  afterEach(() => {
    getRecentMock.mockReset();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).chrome;
  });

  describe("load", () => {
    let loader: BookmarkLoader;

    beforeEach(() => {
      loader = new BookmarkLoader();

      getRecentMock.mockImplementation(
        (
          numberOfItems: number,
          callback: (results: chrome.bookmarks.BookmarkTreeNode[]) => void
        ) => {
          callback([
            {
              id: "1",
              title: "test",
              url: "https://example.com",
            },
          ]);
        }
      );
    });

    test("returns an array of items", () => {
      // update() will be called internally
      loader = new BookmarkLoader();

      expect(loader.load()).toEqual([
        {
          id: "bookmark-1",
          type: ItemType.Bookmark,
          title: "test",
          url: "https://example.com",
        },
      ]);
    });

    test("onCreated", () => {
      expect(loader.load()).toHaveLength(0);
      onCreatedCallback();
      expect(loader.load()).toHaveLength(1);
    });

    test("onCreated during import", () => {
      expect(loader.load()).toHaveLength(0);
      onImportBeganCallback();
      onCreatedCallback();
      expect(loader.load()).toHaveLength(0);
      onImportEndedCallback();
      onCreatedCallback();
      expect(loader.load()).toHaveLength(1);
    });

    test("onChanged", () => {
      expect(loader.load()).toHaveLength(0);
      onChangedCallback();
      expect(loader.load()).toHaveLength(1);
    });

    test("onRemoved", () => {
      expect(loader.load()).toHaveLength(0);
      onRemovedCallback();
      expect(loader.load()).toHaveLength(1);
    });
  });
});

import { ItemType } from "../../lib/types";
import { HistoryLoader } from "./HistoryLoader";

describe("HistoryLoader", () => {
  let onVisitedCallback: () => void;
  let onVisitRemovedCallback: () => void;
  const searchMock = jest.fn();

  beforeEach(() => {
    global.chrome = {
      history: {
        onVisited: {
          addListener: (callback: () => void) => {
            onVisitedCallback = callback;
          },
        },
        onVisitRemoved: {
          addListener: (callback: () => void) => {
            onVisitRemovedCallback = callback;
          },
        },
        search: searchMock,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });

  afterEach(() => {
    searchMock.mockReset();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).chrome;
  });

  describe("load", () => {
    let loader: HistoryLoader;

    beforeEach(() => {
      loader = new HistoryLoader();

      searchMock.mockImplementation(
        (
          numberOfItems: number,
          callback: (results: chrome.history.HistoryItem[]) => void
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
      loader = new HistoryLoader();

      expect(loader.items).toEqual([
        {
          id: "history-1",
          type: ItemType.History,
          title: "test",
          url: "https://example.com",
        },
      ]);
    });

    test("onVisited", () => {
      expect(loader.items).toHaveLength(0);
      onVisitedCallback();
      expect(loader.items).toHaveLength(1);
    });

    test("onVisitRemoved", () => {
      expect(loader.items).toHaveLength(0);
      onVisitRemovedCallback();
      expect(loader.items).toHaveLength(1);
    });
  });
});

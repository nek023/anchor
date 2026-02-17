import { ItemType } from "../../shared/types";
import { HistoryLoader } from "./HistoryLoader";

describe("HistoryLoader", () => {
  let onVisitedCallback: () => void;
  let onVisitRemovedCallback: () => void;
  const searchFunc = jest.fn();

  const mockSearch = (results: chrome.history.HistoryItem[]) => {
    searchFunc.mockImplementation(
      (
        numberOfItems: number,
        callback: (results: chrome.history.HistoryItem[]) => void,
      ) => {
        callback(results);
      },
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
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
        search: searchFunc,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });

  afterEach(() => {
    jest.useRealTimers();
    searchFunc.mockReset();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).chrome;
  });

  describe("load", () => {
    test("returns items", () => {
      mockSearch([
        {
          id: "1",
          title: "test",
          url: "https://example.com",
        },
      ]);
      const loader = new HistoryLoader();
      expect(loader.items).toEqual([
        {
          id: "history-1",
          type: ItemType.History,
          title: "test",
          url: "https://example.com",
        },
      ]);
    });
  });

  describe("handling onVisited events", () => {
    test("items will be updated when onVisited event occurred", () => {
      const loader = new HistoryLoader();
      mockSearch([
        {
          id: "1",
          title: "test",
          url: "https://example.com",
        },
      ]);
      expect(loader.items).toHaveLength(0);

      onVisitedCallback();
      jest.advanceTimersByTime(200);
      expect(loader.items).toHaveLength(1);
    });
  });

  describe("handling onVisitRemoved events", () => {
    test("items will be updated when onVisitRemoved event occurred", () => {
      const loader = new HistoryLoader();
      mockSearch([
        {
          id: "1",
          title: "test",
          url: "https://example.com",
        },
      ]);
      expect(loader.items).toHaveLength(0);

      onVisitRemovedCallback();
      jest.advanceTimersByTime(200);
      expect(loader.items).toHaveLength(1);
    });
  });
});

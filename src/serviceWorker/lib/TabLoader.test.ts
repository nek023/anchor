import { ItemType } from "../../lib/types";
import { TabLoader } from "./TabLoader";

describe("TabLoader", () => {
  let onCreatedCallback: () => void;
  let onRemovedCallback: () => void;
  let onReplacedCallback: () => void;
  let onUpdatedCallback: () => void;
  const queryFunc = jest.fn();

  const mockQuery = (results: chrome.tabs.Tab[]) => {
    queryFunc.mockImplementation(
      (
        numberOfItems: number,
        callback: (results: chrome.tabs.Tab[]) => void
      ) => {
        callback(results);
      }
    );
  };

  beforeEach(() => {
    global.chrome = {
      tabs: {
        onCreated: {
          addListener: (callback: () => void) => {
            onCreatedCallback = callback;
          },
        },
        onRemoved: {
          addListener: (callback: () => void) => {
            onRemovedCallback = callback;
          },
        },
        onReplaced: {
          addListener: (callback: () => void) => {
            onReplacedCallback = callback;
          },
        },
        onUpdated: {
          addListener: (callback: () => void) => {
            onUpdatedCallback = callback;
          },
        },
        query: queryFunc,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });

  afterEach(() => {
    queryFunc.mockReset();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).chrome;
  });

  describe("load", () => {
    test("returns items", () => {
      mockQuery([
        {
          id: 1,
          title: "test",
          url: "https://example.com",
          favIconUrl: "https://example.com/favicon.ico",
          index: 1,
          windowId: 1,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any);
      const loader = new TabLoader();
      expect(loader.items).toEqual([
        {
          id: "tab-1",
          type: ItemType.Tab,
          favIconUrl: "https://example.com/favicon.ico",
          title: "test",
          url: "https://example.com",
          tabIndex: 1,
          windowId: 1,
        },
      ]);
    });
  });

  describe("handling onCreated events", () => {
    test("items will be updated when onCreated event occurred", () => {
      const loader = new TabLoader();
      mockQuery([
        {
          id: 1,
          title: "test",
          url: "https://example.com",
          favIconUrl: "https://example.com/favicon.ico",
          index: 1,
          windowId: 1,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any);
      expect(loader.items).toHaveLength(0);

      onCreatedCallback();
      expect(loader.items).toHaveLength(1);
    });
  });

  describe("handling onRemoved events", () => {
    test("items will be updated when onRemoved event occurred", () => {
      const loader = new TabLoader();
      mockQuery([
        {
          id: 1,
          title: "test",
          url: "https://example.com",
          favIconUrl: "https://example.com/favicon.ico",
          index: 1,
          windowId: 1,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any);
      expect(loader.items).toHaveLength(0);

      onRemovedCallback();
      expect(loader.items).toHaveLength(1);
    });
  });

  describe("handling onReplaced events", () => {
    test("items will be updated when onReplaced event occurred", () => {
      const loader = new TabLoader();
      mockQuery([
        {
          id: 1,
          title: "test",
          url: "https://example.com",
          favIconUrl: "https://example.com/favicon.ico",
          index: 1,
          windowId: 1,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any);
      expect(loader.items).toHaveLength(0);

      onReplacedCallback();
      expect(loader.items).toHaveLength(1);
    });
  });

  describe("handling onUpdated events", () => {
    test("items will be updated when onUpdated event occurred", () => {
      const loader = new TabLoader();
      mockQuery([
        {
          id: 1,
          title: "test",
          url: "https://example.com",
          favIconUrl: "https://example.com/favicon.ico",
          index: 1,
          windowId: 1,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any);
      expect(loader.items).toHaveLength(0);

      onUpdatedCallback();
      expect(loader.items).toHaveLength(1);
    });
  });
});

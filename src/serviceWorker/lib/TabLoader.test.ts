import { ItemType } from "../../lib/types";
import { TabLoader } from "./TabLoader";

describe("TabLoader", () => {
  let onCreatedCallback: () => void;
  let onRemovedCallback: () => void;
  let onReplacedCallback: () => void;
  let onUpdatedCallback: () => void;
  const queryMock = jest.fn();

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
        query: queryMock,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });

  afterEach(() => {
    queryMock.mockReset();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).chrome;
  });

  describe("load", () => {
    let loader: TabLoader;

    beforeEach(() => {
      loader = new TabLoader();

      queryMock.mockImplementation(
        (
          numberOfItems: number,
          callback: (results: chrome.tabs.Tab[]) => void
        ) => {
          callback([
            {
              id: 1,
              title: "test",
              url: "https://example.com",
              favIconUrl: "https://example.com/favicon.ico",
              index: 1,
              windowId: 1,
              pinned: false,
              highlighted: false,
              active: false,
              incognito: false,
              selected: false,
              discarded: false,
              autoDiscardable: false,
              groupId: 1,
            },
          ]);
        }
      );
    });

    test("returns an array of items", () => {
      // update() will be called internally
      loader = new TabLoader();

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

    test("onCreated", () => {
      expect(loader.items).toHaveLength(0);
      onCreatedCallback();
      expect(loader.items).toHaveLength(1);
    });

    test("onRemoved", () => {
      expect(loader.items).toHaveLength(0);
      onRemovedCallback();
      expect(loader.items).toHaveLength(1);
    });

    test("onReplaced", () => {
      expect(loader.items).toHaveLength(0);
      onReplacedCallback();
      expect(loader.items).toHaveLength(1);
    });

    test("onUpdated", () => {
      expect(loader.items).toHaveLength(0);
      onUpdatedCallback();
      expect(loader.items).toHaveLength(1);
    });
  });
});

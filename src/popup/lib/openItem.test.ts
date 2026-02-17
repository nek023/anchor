import { openItem } from "./openItem";
import { BookmarkItem, HistoryItem, ItemType, TabItem } from "../../shared/types";

describe("openItem", () => {
  const highlightFunc = jest.fn();
  const createFunc = jest.fn();
  const updateFunc = jest.fn();

  beforeEach(() => {
    global.chrome = {
      tabs: {
        highlight: highlightFunc,
        create: createFunc,
      },
      windows: {
        update: updateFunc,
      },
      runtime: {
        lastError: undefined,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });

  afterEach(() => {
    highlightFunc.mockReset();
    createFunc.mockReset();
    updateFunc.mockReset();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).chrome;
  });

  test("highlights tab and focuses window for TabItem", () => {
    const item: TabItem = {
      id: "tab-1",
      type: ItemType.Tab,
      title: "test",
      url: "https://example.com",
      tabIndex: 0,
      windowId: 1,
    };

    highlightFunc.mockImplementation(
      (
        params: chrome.tabs.HighlightInfo,
        callback: (window: chrome.windows.Window) => void,
      ) => {
        callback({ id: 1 } as chrome.windows.Window);
      },
    );

    openItem(item);

    expect(highlightFunc).toHaveBeenCalledWith(
      { tabs: 0, windowId: 1 },
      expect.any(Function),
    );
    expect(updateFunc).toHaveBeenCalledWith(1, { focused: true });
  });

  test("falls back to creating tab when highlight fails", () => {
    const item: TabItem = {
      id: "tab-1",
      type: ItemType.Tab,
      title: "test",
      url: "https://example.com",
      tabIndex: 0,
      windowId: 1,
    };

    highlightFunc.mockImplementation(
      (
        params: chrome.tabs.HighlightInfo,
        callback: (window: chrome.windows.Window) => void,
      ) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (chrome.runtime as any).lastError = { message: "No tab with id" };
        callback(undefined as unknown as chrome.windows.Window);
      },
    );

    openItem(item);

    expect(createFunc).toHaveBeenCalledWith({ url: "https://example.com" });
    expect(updateFunc).not.toHaveBeenCalled();
  });

  test("creates tab for BookmarkItem", () => {
    const item: BookmarkItem = {
      id: "bookmark-1",
      type: ItemType.Bookmark,
      title: "test",
      url: "https://example.com",
    };

    openItem(item);

    expect(createFunc).toHaveBeenCalledWith({ url: "https://example.com" });
    expect(highlightFunc).not.toHaveBeenCalled();
  });

  test("creates tab for HistoryItem", () => {
    const item: HistoryItem = {
      id: "history-1",
      type: ItemType.History,
      title: "test",
      url: "https://example.com",
    };

    openItem(item);

    expect(createFunc).toHaveBeenCalledWith({ url: "https://example.com" });
    expect(highlightFunc).not.toHaveBeenCalled();
  });
});

import { parseQuery } from "./lib/parseQuery";

const mockSearchItems = jest.fn().mockReturnValue([]);

jest.mock("./lib/DisplayManager", () => ({
  DisplayManager: jest.fn().mockImplementation(() => ({
    displayContainsWindow: jest.fn(),
    primaryDisplay: {
      bounds: { left: 0, top: 0, width: 1920, height: 1080 },
    },
  })),
}));

jest.mock("./lib/ItemManager", () => ({
  ItemManager: jest.fn().mockImplementation(() => ({
    searchItems: mockSearchItems,
  })),
}));

jest.mock("./lib/BookmarkLoader", () => ({
  BookmarkLoader: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("./lib/HistoryLoader", () => ({
  HistoryLoader: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("./lib/TabLoader", () => ({
  TabLoader: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("../shared/ipc", () => ({
  MessageType: { searchItems: "SEARCH_ITEMS", setQuery: "SET_QUERY" },
  sendMessage: jest.fn().mockResolvedValue(undefined),
  setQuery: jest.fn((query: string) => ({
    type: "SET_QUERY",
    payload: { query },
  })),
}));

jest.mock("./lib/parseQuery", () => ({
  parseQuery: jest.fn().mockReturnValue({ filter: "t", pattern: "" }),
}));

const mockParseQuery = parseQuery as jest.Mock;

describe("service_worker", () => {
  let commandCallback: (command: string) => void;
  let messageCallback: (
    message: { type: string; payload: { query: string } },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sender: any,
    sendResponse: (response: unknown) => void,
  ) => void;
  let windowRemovedCallback: (windowId: number) => void;
  let focusChangedCallback: (windowId: number) => void;

  beforeAll(() => {
    global.chrome = {
      commands: {
        onCommand: {
          addListener: jest.fn((cb) => {
            commandCallback = cb;
          }),
        },
      },
      runtime: {
        onMessage: {
          addListener: jest.fn((cb) => {
            messageCallback = cb;
          }),
        },
        getURL: jest.fn(
          (path: string) => `chrome-extension://test-id/${path}`,
        ),
      },
      windows: {
        getCurrent: jest.fn((cb: (w: chrome.windows.Window) => void) => {
          cb({
            id: 1,
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
          } as chrome.windows.Window);
        }),
        create: jest.fn(
          (options: object, cb?: (w: { id: number }) => void) => {
            if (cb) cb({ id: 100 });
          },
        ),
        update: jest.fn(
          (windowId: number, options: object, cb?: () => void) => {
            if (cb) cb();
          },
        ),
        remove: jest.fn((windowId: number, cb?: () => void) => {
          if (cb) cb();
        }),
        onRemoved: {
          addListener: jest.fn((cb) => {
            windowRemovedCallback = cb;
          }),
        },
        onFocusChanged: {
          addListener: jest.fn((cb) => {
            focusChangedCallback = cb;
          }),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("./index");
  });

  afterAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).chrome;
  });

  beforeEach(() => {
    // Reset module window state before clearing mocks
    windowRemovedCallback(100);

    mockSearchItems.mockClear();
    mockParseQuery.mockClear();
    (chrome.windows.getCurrent as jest.Mock).mockClear();
    (chrome.windows.create as jest.Mock).mockClear();
    (chrome.windows.update as jest.Mock).mockClear();
    (chrome.windows.remove as jest.Mock).mockClear();
  });

  describe("initialization", () => {
    test("registers all Chrome event listeners", () => {
      expect(commandCallback).toBeDefined();
      expect(messageCallback).toBeDefined();
      expect(windowRemovedCallback).toBeDefined();
      expect(focusChangedCallback).toBeDefined();
    });
  });

  describe("message handling", () => {
    test("handles searchItems message with default filter", () => {
      mockParseQuery.mockReturnValue({ filter: "", pattern: "test" });
      const sendResponse = jest.fn();

      messageCallback(
        { type: "SEARCH_ITEMS", payload: { query: "test" } },
        {},
        sendResponse,
      );

      expect(mockParseQuery).toHaveBeenCalledWith("test");
      expect(mockSearchItems).toHaveBeenCalledWith("t", "test");
      expect(sendResponse).toHaveBeenCalled();
    });

    test("handles searchItems message with specific filter", () => {
      mockParseQuery.mockReturnValue({ filter: "b", pattern: "keyword" });
      const sendResponse = jest.fn();

      messageCallback(
        { type: "SEARCH_ITEMS", payload: { query: "b:keyword" } },
        {},
        sendResponse,
      );

      expect(mockSearchItems).toHaveBeenCalledWith("b", "keyword");
    });

    test("ignores non-searchItems messages", () => {
      const sendResponse = jest.fn();

      messageCallback(
        { type: "SET_QUERY", payload: { query: "test" } },
        {},
        sendResponse,
      );

      expect(mockSearchItems).not.toHaveBeenCalled();
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("command handling", () => {
    test("opens window on toggle-anchor command", () => {
      commandCallback("toggle-anchor");

      expect(chrome.windows.getCurrent).toHaveBeenCalled();
    });

    test("opens window on toggle-anchor-with-bookmark-mode command", () => {
      commandCallback("toggle-anchor-with-bookmark-mode");

      expect(chrome.windows.getCurrent).toHaveBeenCalled();
    });

    test("opens window on toggle-anchor-with-history-mode command", () => {
      commandCallback("toggle-anchor-with-history-mode");

      expect(chrome.windows.getCurrent).toHaveBeenCalled();
    });
  });

  describe("window lifecycle", () => {
    test("creates, focuses, removes, and recreates window", () => {
      const mockCreate = chrome.windows.create as jest.Mock;
      const mockRemove = chrome.windows.remove as jest.Mock;

      // Step 1: First command creates a new window
      commandCallback("toggle-anchor");
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining("popup.html"),
          focused: true,
          type: "popup",
        }),
        expect.any(Function),
      );

      // Step 2: Focus the created window
      focusChangedCallback(100);

      // Step 3: Same command while focused removes the window
      mockCreate.mockClear();
      commandCallback("toggle-anchor");
      expect(mockRemove).toHaveBeenCalledWith(100, expect.any(Function));

      // Step 4: After removal, next command creates a new window
      mockCreate.mockClear();
      commandCallback("toggle-anchor");
      expect(mockCreate).toHaveBeenCalled();
    });

    test("clears main window on window removed event", () => {
      const mockCreate = chrome.windows.create as jest.Mock;

      // Create a window
      commandCallback("toggle-anchor");
      focusChangedCallback(100);

      // External removal (e.g., user closes the window)
      windowRemovedCallback(100);

      // Next command should create a new window
      mockCreate.mockClear();
      commandCallback("toggle-anchor");
      expect(mockCreate).toHaveBeenCalled();
    });

    test("ignores removal of unrelated windows", () => {
      const mockCreate = chrome.windows.create as jest.Mock;

      // Create a window
      commandCallback("toggle-anchor");
      focusChangedCallback(100);

      // Removal of a different window
      windowRemovedCallback(999);

      // Next command should remove (not create) since main window is still focused
      mockCreate.mockClear();
      commandCallback("toggle-anchor");
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });
});

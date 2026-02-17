import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { App } from "./App";
import { openItem } from "../lib/openItem";
import { closeCurrentWindow } from "../lib/closeCurrentWindow";
import { ItemType, TabItem } from "../../shared/types";
import { UseSearchResultsCallback } from "../lib/useQueryResults";
import { ExtensionMessageCallback } from "../lib/useExtensionMessage";
import { MessageType } from "../../shared/ipc";

jest.mock("../lib/closeCurrentWindow", () => ({
  closeCurrentWindow: jest.fn(),
}));

jest.mock("../lib/openItem", () => ({
  openItem: jest.fn(),
}));

jest.mock("../lib/useThrottle", () => ({
  useThrottle: <T,>(value: T) => value,
}));

let extensionMessageCallback: ExtensionMessageCallback;
jest.mock("../lib/useExtensionMessage", () => ({
  useExtensionMessage: (callback: ExtensionMessageCallback) => {
    extensionMessageCallback = callback;
  },
}));

let searchCallback: UseSearchResultsCallback;
jest.mock("../lib/useQueryResults", () => ({
  useSearchResults: (_query: string, callback: UseSearchResultsCallback) => {
    searchCallback = callback;
  },
}));

const mockOpenItem = openItem as jest.Mock;
const mockCloseCurrentWindow = closeCurrentWindow as jest.Mock;

const createTabItems = (count: number): TabItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `tab-${i}`,
    type: ItemType.Tab,
    title: `Tab ${i}`,
    url: `https://example.com/${i}`,
    tabIndex: i,
    windowId: 1,
  }));

const fireKeyDown = (options: { code: string; ctrlKey?: boolean }) =>
  fireEvent.keyDown(document.activeElement || document.body, options);

describe("App", () => {
  beforeEach(() => {
    global.chrome = {
      runtime: {
        onMessage: {
          addListener: jest.fn(),
          removeListener: jest.fn(),
        },
        getURL: jest.fn(
          (path: string) => `chrome-extension://test-id/${path}`,
        ),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });

  afterEach(() => {
    mockOpenItem.mockReset();
    mockCloseCurrentWindow.mockReset();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).chrome;
  });

  test("renders search bar", () => {
    const { container } = render(<App />);
    const input = container.querySelector("input");

    expect(input).not.toBeNull();
  });

  test("shows search results", () => {
    const { getByText } = render(<App />);

    act(() => searchCallback(createTabItems(2)));

    expect(getByText("Tab 0")).toBeInTheDocument();
    expect(getByText("Tab 1")).toBeInTheDocument();
  });

  test("first item is selected by default", () => {
    const { container } = render(<App />);

    act(() => searchCallback(createTabItems(2)));

    const selectedItems = container.querySelectorAll(".bg-blue-700");
    expect(selectedItems).toHaveLength(1);
    expect(selectedItems[0].textContent).toContain("Tab 0");
  });

  test("arrow down selects next item", () => {
    const { container } = render(<App />);

    act(() => searchCallback(createTabItems(3)));
    fireKeyDown({ code: "ArrowDown" });

    const selectedItems = container.querySelectorAll(".bg-blue-700");
    expect(selectedItems).toHaveLength(1);
    expect(selectedItems[0].textContent).toContain("Tab 1");
  });

  test("arrow up selects previous item", () => {
    const { container } = render(<App />);

    act(() => searchCallback(createTabItems(3)));
    fireKeyDown({ code: "ArrowDown" });
    fireKeyDown({ code: "ArrowDown" });
    fireKeyDown({ code: "ArrowUp" });

    const selectedItems = container.querySelectorAll(".bg-blue-700");
    expect(selectedItems).toHaveLength(1);
    expect(selectedItems[0].textContent).toContain("Tab 1");
  });

  test("arrow up does not go below zero", () => {
    const { container } = render(<App />);

    act(() => searchCallback(createTabItems(2)));
    fireKeyDown({ code: "ArrowUp" });

    const selectedItems = container.querySelectorAll(".bg-blue-700");
    expect(selectedItems).toHaveLength(1);
    expect(selectedItems[0].textContent).toContain("Tab 0");
  });

  test("arrow down does not exceed items length", () => {
    const { container } = render(<App />);

    act(() => searchCallback(createTabItems(2)));
    fireKeyDown({ code: "ArrowDown" });
    fireKeyDown({ code: "ArrowDown" });

    const selectedItems = container.querySelectorAll(".bg-blue-700");
    expect(selectedItems).toHaveLength(1);
    expect(selectedItems[0].textContent).toContain("Tab 1");
  });

  test("enter opens selected item and closes window", () => {
    render(<App />);
    const items = createTabItems(2);

    act(() => searchCallback(items));
    fireKeyDown({ code: "ArrowDown" });
    fireKeyDown({ code: "Enter" });

    expect(mockOpenItem).toHaveBeenCalledWith(items[1]);
    expect(mockCloseCurrentWindow).toHaveBeenCalled();
  });

  test("enter does nothing when items are empty", () => {
    render(<App />);

    fireKeyDown({ code: "Enter" });

    expect(mockOpenItem).not.toHaveBeenCalled();
  });

  test("selectedItemIndex resets on query change", () => {
    const { container } = render(<App />);

    act(() => searchCallback(createTabItems(3)));
    fireKeyDown({ code: "ArrowDown" });
    fireKeyDown({ code: "ArrowDown" });

    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "new query" } });

    const selectedItems = container.querySelectorAll(".bg-blue-700");
    expect(selectedItems).toHaveLength(1);
    expect(selectedItems[0].textContent).toContain("Tab 0");
  });

  test("selectedItemIndex resets on setQuery extension message", () => {
    const { container } = render(<App />);

    act(() => searchCallback(createTabItems(3)));
    fireKeyDown({ code: "ArrowDown" });
    fireKeyDown({ code: "ArrowDown" });

    const sendResponse = jest.fn();
    act(() => {
      extensionMessageCallback(
        {
          type: MessageType.setQuery,
          payload: { query: "b:" },
        },
        {} as chrome.runtime.MessageSender,
        sendResponse,
      );
    });

    const selectedItems = container.querySelectorAll(".bg-blue-700");
    expect(selectedItems).toHaveLength(1);
    expect(selectedItems[0].textContent).toContain("Tab 0");
    expect(sendResponse).toHaveBeenCalledWith(true);
  });

  test("clicking an item opens it and closes window", () => {
    const { getByText } = render(<App />);
    const items = createTabItems(2);

    act(() => searchCallback(items));
    fireEvent.click(getByText("Tab 1"));

    expect(mockOpenItem).toHaveBeenCalledWith(items[1]);
    expect(mockCloseCurrentWindow).toHaveBeenCalled();
  });
});

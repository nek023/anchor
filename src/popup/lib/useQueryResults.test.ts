import { renderHook, waitFor } from "@testing-library/react";
import { useSearchResults } from "./useQueryResults";
import { sendMessage } from "../../shared/ipc";

jest.mock("../../shared/ipc", () => ({
  searchItems: jest.fn((query: string) => ({
    type: "SEARCH_ITEMS",
    payload: { query },
  })),
  sendMessage: jest.fn(),
}));

describe("useSearchResults", () => {
  const mockSendMessage = sendMessage as jest.Mock;

  afterEach(() => {
    mockSendMessage.mockReset();
  });

  test("calls callback with search results", async () => {
    const items = [
      {
        id: "tab-1",
        type: "tab",
        title: "test",
        url: "https://example.com",
        tabIndex: 0,
        windowId: 1,
      },
    ];
    mockSendMessage.mockResolvedValue(items);
    const callback = jest.fn();

    renderHook(() => useSearchResults("test", callback));

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(items);
    });
  });

  test("re-fetches when query changes", async () => {
    mockSendMessage.mockResolvedValue([]);
    const callback = jest.fn();

    const { rerender } = renderHook(
      ({ query }) => useSearchResults(query, callback),
      { initialProps: { query: "first" } },
    );

    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(1);
    });

    rerender({ query: "second" });

    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});

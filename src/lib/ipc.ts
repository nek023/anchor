export const MessageType = {
  SearchItems: "SEARCH_ITEMS",
  SetQuery: "SET_QUERY",
} as const;

export const searchItems = (query: string) => ({
  type: MessageType.SearchItems,
  payload: { query },
});

export const setQuery = (query: string) => ({
  type: MessageType.SetQuery,
  payload: { query },
});

export type Message = ReturnType<typeof searchItems | typeof setQuery>;

export const sendMessage = (message: Message) =>
  new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (response != null) {
        resolve(response);
      } else {
        reject(chrome.runtime.lastError);
      }
    });
  });

export const MessageType = {
  searchItems: "SEARCH_ITEMS",
  setQuery: "SET_QUERY",
} as const;

export const searchItems = (query: string) => ({
  type: MessageType.searchItems,
  payload: { query },
});

export const setQuery = (query: string) => ({
  type: MessageType.setQuery,
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

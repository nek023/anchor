export const MessageType = {
  searchItems: "SEARCH_ITEMS",
  setQuery: "SET_QUERY",
};

export const searchItems = (query: string) => ({
  type: MessageType.searchItems,
  payload: { query },
});

export const setQuery = (query: string) => ({
  type: MessageType.setQuery,
  payload: { query },
});

export type Message = ReturnType<typeof searchItems | typeof setQuery>;

export const sendMessage = <T = unknown>(message: Message) =>
  new Promise<T>((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });

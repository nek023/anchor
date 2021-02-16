export const MessageType = {
  QueryItems: "QUERY_ITEMS",
  SetQuery: "SET_QUERY",
} as const;

export const queryItems = (query: string) => ({
  type: MessageType.QueryItems,
  payload: { query },
});

export const setQuery = (query: string) => ({
  type: MessageType.SetQuery,
  payload: { query },
});

export type Message = ReturnType<typeof queryItems | typeof setQuery>;

export const sendMessage = (message: Message) =>
  new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (response) {
        resolve(response);
      } else {
        reject(chrome.runtime.lastError);
      }
    });
  });

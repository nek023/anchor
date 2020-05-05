export enum MessageType {
  QUERY_ITEMS = 'QUERY_ITEMS',
  SET_QUERY = 'SET_QUERY',
}

export const queryItems = (query: string) => ({
  type: MessageType.QUERY_ITEMS as const,
  payload: { query },
})

export const setQuery = (query: string) => ({
  type: MessageType.SET_QUERY as const,
  payload: { query },
})

export type Message =
  | ReturnType<typeof queryItems>
  | ReturnType<typeof setQuery>

export const sendMessage = async (message: Message) =>
  new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (response) {
        resolve(response)
      } else {
        reject(chrome.runtime.lastError)
      }
    })
  })

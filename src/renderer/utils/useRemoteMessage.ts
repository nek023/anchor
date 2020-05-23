import { useEffect } from 'react'
import { Message } from '../../common/ipc'

export const useRemoteMessage = (
  callback: (
    message: Message,
    sender: chrome.runtime.MessageSender,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendResponse: (response?: any) => void
  ) => void
) => {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(callback)
    return () => chrome.runtime.onMessage.removeListener(callback)
  }, [callback])
}

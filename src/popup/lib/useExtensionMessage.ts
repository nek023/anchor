import { useEffect } from "react";
import { Message } from "../../lib/ipc";

export type ExtensionMessageCallback = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendResponse: (response?: any) => void
) => void;

export const useExtensionMessage = (callback: ExtensionMessageCallback) => {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(callback);
    return () => chrome.runtime.onMessage.removeListener(callback);
  }, [callback]);
};

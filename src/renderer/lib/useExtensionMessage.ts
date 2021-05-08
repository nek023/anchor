import { useEffect } from "react";
import { Message } from "../../common/ipc";

type ExtensionMessageEventCallback = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendResponse: (response?: any) => void
) => void;

export const useExtensionMessage = (
  callback: ExtensionMessageEventCallback
) => {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(callback);
    return () => chrome.runtime.onMessage.removeListener(callback);
  }, [callback]);
};

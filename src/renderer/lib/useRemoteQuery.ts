import { useCallback, useEffect } from "react";
import { Message, MessageType } from "../../common/ipc";

type ExtensionMessageEventCallback = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: Message,
  sender: chrome.runtime.MessageSender,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendResponse: (response?: any) => void
) => void;

export const useRemoteQuery = (callback: (query: string) => void) => {
  const handleMessage = useCallback<ExtensionMessageEventCallback>(
    (message, sender, sendResponse) => {
      if (message.type === MessageType.SetQuery) {
        callback(message.payload.query);
        sendResponse(true);
      }
    },
    [callback]
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, [handleMessage]);
};

import { useRemoteMessage } from "./useRemoteMessage";
import { MessageType } from "../../common/ipc";

export const useRemoteQuery = (callback: (query: string) => void) => {
  useRemoteMessage((message, sender, sendResponse) => {
    if (message.type === MessageType.SetQuery) {
      callback(message.payload.query);
      sendResponse(true);
    }
  });
};

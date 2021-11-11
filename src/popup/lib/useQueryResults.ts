import { useEffect } from "react";
import { Item } from "../../common/types";
import { queryItems, sendMessage } from "../../common/ipc";

export type QueryResultsCallback = (items: Item[]) => void;

export const useQueryResults = (
  query: string,
  callback: QueryResultsCallback
) => {
  useEffect(() => {
    (async () => {
      const items = (await sendMessage(queryItems(query))) as Item[];
      callback(items);
    })();
  }, [callback, query]);
};

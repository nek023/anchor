import { useEffect } from "react";
import { Item } from "../../lib/types";
import { queryItems, sendMessage } from "../../lib/ipc";

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

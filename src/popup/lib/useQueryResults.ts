import { useEffect } from "react";
import { Item } from "../../lib/types";
import { searchItems, sendMessage } from "../../lib/ipc";

export type UseSearchResultsCallback = (items: Item[]) => void;

export const useSearchResults = (
  query: string,
  callback: UseSearchResultsCallback
) => {
  useEffect(() => {
    (async () => {
      const items = (await sendMessage(searchItems(query))) as Item[];
      callback(items);
    })();
  }, [callback, query]);
};

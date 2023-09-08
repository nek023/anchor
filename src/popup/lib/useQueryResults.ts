import { useEffect } from "react";
import { Item } from "../../shared/types";
import { searchItems, sendMessage } from "../../shared/ipc";

export type UseSearchResultsCallback = (items: Item[]) => void;

export const useSearchResults = (
  query: string,
  callback: UseSearchResultsCallback,
) => {
  useEffect(() => {
    (async () => {
      const items = (await sendMessage(searchItems(query))) as Item[];
      callback(items);
    })();
  }, [callback, query]);
};

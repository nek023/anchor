import React, { useCallback, useState } from "react";
import { ResultList } from "./ResultList";
import { SearchBar } from "./SearchBar";
import { KeyboardEventHandler } from "./KeyboardEventHandler";
import { MessageType } from "../../shared/ipc";
import { Item } from "../../shared/types";
import { closeCurrentWindow } from "../lib/closeCurrentWindow";
import { openItem } from "../lib/openItem";
import { useThrottle } from "../lib/useThrottle";
import {
  ExtensionMessageCallback,
  useExtensionMessage,
} from "../lib/useExtensionMessage";
import {
  UseSearchResultsCallback,
  useSearchResults,
} from "../lib/useQueryResults";

const initialQuery = new URL(document.URL).searchParams.get("q") || "";

export const App: React.FC = () => {
  const [query, setQuery] = useState(initialQuery);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const handleExtensionMessage = useCallback<ExtensionMessageCallback>(
    (message, sender, sendResponse) => {
      if (message.type === MessageType.SetQuery) {
        setQuery(message.payload.query);
        sendResponse(true);
      }
    },
    []
  );
  useExtensionMessage(handleExtensionMessage);

  const throttledQuery = useThrottle(query, 50);
  const handleSearchResults = useCallback<UseSearchResultsCallback>(
    (items) => setItems(items),
    []
  );
  useSearchResults(throttledQuery, handleSearchResults);

  const handleEnter = useCallback(() => {
    if (items.length === 0) return;
    openItem(items[selectedItemIndex]);
    closeCurrentWindow();
  }, [items, selectedItemIndex]);

  const handleUp = useCallback(() => {
    if (selectedItemIndex <= 0) return;
    setSelectedItemIndex(selectedItemIndex - 1);
  }, [selectedItemIndex]);

  const handleDown = useCallback(() => {
    if (selectedItemIndex >= items.length - 1) return;
    setSelectedItemIndex(selectedItemIndex + 1);
  }, [items.length, selectedItemIndex]);

  const handleItemClick = useCallback(
    (index: number) => {
      setSelectedItemIndex(index);
      openItem(items[index]);
      closeCurrentWindow();
    },
    [items]
  );

  const handleValueChange = useCallback(
    (query: string) => {
      setQuery(query);
      setSelectedItemIndex(0);
    },
    [setQuery]
  );

  return (
    <KeyboardEventHandler
      onEnter={handleEnter}
      onEscape={closeCurrentWindow}
      onUp={handleUp}
      onDown={handleDown}
    >
      <div className="w-screen h-screen p-2 flex flex-col gap-2">
        <SearchBar value={query} onValueChange={handleValueChange} />
        <ResultList
          items={items}
          onItemClick={handleItemClick}
          selectedItemIndex={selectedItemIndex}
        />
      </div>
    </KeyboardEventHandler>
  );
};

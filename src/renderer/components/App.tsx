import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useThrottle } from "react-use";
import { ResultList } from "./ResultList";
import { SearchBar } from "./SearchBar";
import { KeyboardEventHandler } from "./KeyboardEventHandler";
import { MessageType } from "../../common/ipc";
import { Item } from "../../common/types";
import { closeCurrentWindow } from "../lib/closeCurrentWindow";
import { openItem } from "../lib/openItem";
import {
  ExtensionMessageCallback,
  useExtensionMessage,
} from "../lib/useExtensionMessage";
import { QueryResultsCallback, useQueryResults } from "../lib/useQueryResults";

const Container = styled.div`
  padding: 8px;
`;

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
  const handleQueryResults = useCallback<QueryResultsCallback>(
    (items) => setItems(items.slice(0, 100)),
    []
  );
  useQueryResults(throttledQuery, handleQueryResults);

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

  const handleValueChange = useCallback((query: string) => setQuery(query), [
    setQuery,
  ]);

  return (
    <KeyboardEventHandler
      onEnter={handleEnter}
      onEscape={closeCurrentWindow}
      onUp={handleUp}
      onDown={handleDown}
    >
      <Container>
        <SearchBar value={query} onValueChange={handleValueChange} />
        <ResultList
          items={items}
          onItemClick={handleItemClick}
          selectedItemIndex={selectedItemIndex}
        />
      </Container>
    </KeyboardEventHandler>
  );
};
